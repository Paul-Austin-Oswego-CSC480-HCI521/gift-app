#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createFigmaClient, extractFigmaComponents } from './lib/figma.js';
import { fetchStorybookIndex, buildStoryUrl, DEFAULT_STORYBOOK_URL } from './lib/storybook.js';
import { buildStoryLookup, matchComponentToStory } from './lib/matcher.js';

// Default Carbon Design System Figma Community File Key
export const DEFAULT_CARBON_FIGMA_FILE_KEY = 'S7kuccbyXb0YzxXZWWkDxA';

/**
 * Loads .env file if it exists (using Node's built-in loader or fallback).
 */
export function loadEnvFiles() {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'frontend', '.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        if (typeof process.loadEnvFile === 'function') {
          process.loadEnvFile(envPath);
        } else {
          const content = fs.readFileSync(envPath, 'utf8');
          for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx > 0) {
              const key = trimmed.slice(0, eqIdx).trim();
              const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          }
        }
      } catch (err) {
        // Silently continue if env file cannot be parsed
      }
    }
  }
}

/**
 * Parses CLI arguments.
 */
export function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    dryRun: false,
    includeVariants: false,
    overridesPath: 'figma-storybook-overrides.json',
    reportPath: 'unmatched-components.json',
    fileKey: process.env.FIGMA_FILE_KEY || process.env.VITE_FIGMA_FILE_KEY || DEFAULT_CARBON_FIGMA_FILE_KEY,
    token: process.env.FIGMA_API_TOKEN || process.env.FIGMA_API_KEY || process.env.VITE_FIGMA_API_KEY || '',
    storybookUrl: process.env.STORYBOOK_URL || DEFAULT_STORYBOOK_URL,
    failOnUnmatched: false,
    verbose: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--include-variants') {
      options.includeVariants = true;
    } else if (arg === '--fail-on-unmatched' || arg === '--strict-unmatched') {
      options.failOnUnmatched = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--file-key' || arg === '-k') {
      options.fileKey = argv[++i];
    } else if (arg === '--token' || arg === '-t') {
      options.token = argv[++i];
    } else if (arg === '--overrides' || arg === '-o') {
      options.overridesPath = argv[++i];
    } else if (arg === '--report' || arg === '-r') {
      options.reportPath = argv[++i];
    } else if (arg === '--storybook-url' || arg === '-s') {
      options.storybookUrl = argv[++i];
    }
  }

  return options;
}

/**
 * Loads manual overrides JSON file if it exists.
 */
export function loadOverrides(filePath) {
  if (!filePath) return {};
  const resolved = path.resolve(process.cwd(), filePath);
  if (fs.existsSync(resolved)) {
    try {
      const content = fs.readFileSync(resolved, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.warn(`[Warning] Could not parse overrides file at ${resolved}:`, err.message);
    }
  }
  return {};
}

/**
 * Retrieves all Figma components and component sets from a file.
 * First tries walking the document tree from getFile; if the file is too large
 * for a full tree fetch (Figma 400 "Request too large"), it gracefully queries
 * the /component_sets and /components metadata endpoints.
 *
 * @param {object} figmaClient
 * @param {string} fileKey
 * @param {object} [options]
 * @param {boolean} [options.includeVariants=false]
 */
export async function fetchFigmaComponentsList(figmaClient, fileKey, { includeVariants = false } = {}) {
  try {
    const fileData = await figmaClient.getFile(fileKey);
    if (fileData?.document) {
      const extracted = extractFigmaComponents(fileData.document);
      if (includeVariants) return extracted;
      return extracted.filter(c => c.type === 'COMPONENT_SET' || (c.type === 'COMPONENT' && c.parentType !== 'COMPONENT_SET'));
    }
  } catch (err) {
    if (!err.message.includes('400') && !err.message.includes('too large')) {
      throw err;
    }
    console.log('   (Large Figma file detected; querying component sets and components endpoints)');
  }

  // Fallback for large files
  const [sets, comps] = await Promise.all([
    figmaClient.getComponentSets(fileKey).catch(() => []),
    figmaClient.getComponents(fileKey).catch(() => []),
  ]);

  const list = [];
  const seenIds = new Set();

  for (const set of sets) {
    if (set.node_id && !seenIds.has(set.node_id)) {
      seenIds.add(set.node_id);
      list.push({
        id: set.node_id,
        name: set.name,
        type: 'COMPONENT_SET',
        parentName: set.containing_frame?.name || null,
      });
    }
  }

  for (const comp of comps) {
    if (comp.node_id && !seenIds.has(comp.node_id)) {
      const hasParentSet = Boolean(comp.containing_frame?.containingComponentSet);
      if (!includeVariants && hasParentSet) {
        continue;
      }
      seenIds.add(comp.node_id);
      const parentSetName = comp.containing_frame?.containingComponentSet?.name || comp.containing_frame?.name || null;
      list.push({
        id: comp.node_id,
        name: comp.name,
        type: 'COMPONENT',
        parentName: parentSetName,
      });
    }
  }

  return list;
}

/**
 * Main synchronization routine.
 */
export async function syncFigmaDevResources(options) {
  const {
    dryRun = false,
    includeVariants = false,
    fileKey,
    token,
    overridesPath,
    reportPath,
    storybookUrl = DEFAULT_STORYBOOK_URL,
    failOnUnmatched = false,
    verbose = false,
    figmaClient: customFigmaClient = null,
    storybookIndex: customStorybookIndex = null,
  } = options;

  if (!fileKey) {
    throw new Error('Figma file key is required. Specify FIGMA_FILE_KEY or --file-key');
  }

  if (!token && !customFigmaClient) {
    throw new Error('Figma API token is required. Specify FIGMA_API_TOKEN or FIGMA_API_KEY environment variable, or --token');
  }

  const figmaClient = customFigmaClient || createFigmaClient({ token });
  const overrides = loadOverrides(overridesPath);

  console.log('🔄 Starting Figma ↔ Storybook Dev Resources synchronization');
  console.log(`📁 Figma File Key:   ${fileKey}`);
  console.log(`📖 Storybook URL:     ${storybookUrl}`);
  console.log(`⚙️  Mode:              ${dryRun ? 'DRY-RUN (no write calls)' : 'LIVE (updating Figma)'}`);
  console.log('');

  // 1. Fetch Storybook index, Figma components, and dev resources in parallel
  console.log('⏳ Step 1: Fetching Figma file data and Storybook index...');
  const [figmaComponents, devResourcesData, storybookIndex] = await Promise.all([
    fetchFigmaComponentsList(figmaClient, fileKey, { includeVariants }),
    figmaClient.getDevResources(fileKey),
    customStorybookIndex || fetchStorybookIndex(storybookUrl),
  ]);

  console.log(`   Found ${figmaComponents.length} components/component sets in Figma`);
  console.log(`   Found ${devResourcesData?.length || 0} existing dev resources in Figma`);

  // Build Storybook lookup
  const storyLookup = buildStoryLookup(storybookIndex);

  // Group existing dev resources by node_id
  const existingDevResourcesByNode = new Map();
  for (const res of (devResourcesData || [])) {
    if (!res.node_id) continue;
    if (!existingDevResourcesByNode.has(res.node_id)) {
      existingDevResourcesByNode.set(res.node_id, []);
    }
    existingDevResourcesByNode.get(res.node_id).push(res);
  }

  // 2. Match components
  console.log('⏳ Step 2: Matching Figma components to Storybook stories...');
  const matched = [];
  const unmatched = [];

  const toCreate = [];
  const toUpdate = [];
  const skipped = [];

  for (const component of figmaComponents) {
    const matchResult = matchComponentToStory(component, storyLookup, overrides);

    if (!matchResult.matched || !matchResult.storyId) {
      unmatched.push({
        node_id: component.id,
        name: component.name,
        type: component.type,
        parentName: component.parentName || null,
        reason: matchResult.matchReason,
      });
      if (verbose) {
        console.log(`   ❌ [UNMATCHED] "${component.name}" (ID: ${component.id})`);
      }
      continue;
    }

    const storyId = matchResult.storyId;
    const storyType = matchResult.story?.type || 'story';
    const targetUrl = buildStoryUrl(storyId, { baseUrl: storybookUrl, type: storyType });
    const resourceName = `Storybook: ${component.name}`;

    matched.push({
      component,
      storyId,
      storyUrl: targetUrl,
      matchReason: matchResult.matchReason,
    });

    const existingList = existingDevResourcesByNode.get(component.id) || [];
    // Find matching dev resource (either matching exact name, starting with Storybook, or carbon storybook URL)
    const existing = existingList.find(
      r => r.name === resourceName ||
           r.name.toLowerCase().startsWith('storybook') ||
           (r.url && r.url.includes('carbondesignsystem.com'))
    );

    if (existing) {
      if (existing.url === targetUrl && existing.name === resourceName) {
        skipped.push({
          id: existing.id,
          node_id: component.id,
          name: resourceName,
          url: targetUrl,
          reason: 'already_up_to_date',
        });
        if (verbose) {
          console.log(`   ⏭️  [SKIPPED] "${resourceName}" -> ${targetUrl} (already correct)`);
        }
      } else {
        toUpdate.push({
          id: existing.id,
          node_id: component.id,
          name: resourceName,
          url: targetUrl,
          file_key: fileKey,
          previousUrl: existing.url,
          previousName: existing.name,
        });
        if (verbose) {
          console.log(`   🔄 [UPDATE] "${resourceName}" -> ${targetUrl} (was: ${existing.url})`);
        }
      }
    } else {
      toCreate.push({
        node_id: component.id,
        name: resourceName,
        url: targetUrl,
        file_key: fileKey,
      });
      if (verbose) {
        console.log(`   ➕ [CREATE] "${resourceName}" -> ${targetUrl}`);
      }
    }
  }

  // 3. Write unmatched report if requested
  if (reportPath) {
    const resolvedReport = path.resolve(process.cwd(), reportPath);
    try {
      fs.writeFileSync(resolvedReport, JSON.stringify(unmatched, null, 2), 'utf8');
      console.log(`📄 Wrote ${unmatched.length} unmatched components to ${reportPath}`);
    } catch (err) {
      console.warn(`[Warning] Could not write report to ${resolvedReport}:`, err.message);
    }
  }

  // 4. Perform Figma write operations (if not dry-run)
  if (!dryRun) {
    console.log('⏳ Step 3: Synchronizing dev resources with Figma API...');
    if (toCreate.length > 0) {
      console.log(`   Creating ${toCreate.length} new dev resources...`);
      await figmaClient.createDevResources(toCreate);
    }
    if (toUpdate.length > 0) {
      console.log(`   Updating ${toUpdate.length} existing dev resources...`);
      await figmaClient.updateDevResources(toUpdate);
    }
  } else {
    console.log('🔍 [DRY-RUN] Skipped write API calls (POST/PUT).');
  }

  // 5. Print summary
  console.log('');
  console.log('====================================================');
  console.log('  Figma ↔ Storybook Dev Resources Sync Summary');
  console.log('====================================================');
  console.log(`  Total Figma components: ${figmaComponents.length}`);
  console.log(`  Matched:                ${matched.length}`);
  console.log(`  Unmatched:              ${unmatched.length}`);
  console.log(`  To Create (POST):       ${toCreate.length}`);
  console.log(`  To Update (PUT):        ${toUpdate.length}`);
  console.log(`  Skipped (up to date):   ${skipped.length}`);
  console.log(`  Dry Run:                ${dryRun ? 'YES' : 'NO'}`);
  console.log('====================================================');

  if (unmatched.length > 0) {
    console.log('');
    console.log(`⚠️  ${unmatched.length} component(s) could not be matched automatically.`);
    console.log(`   Add overrides in "${overridesPath}" to map them to specific Storybook story IDs.`);
    if (unmatched.length <= 15) {
      console.log('   Unmatched component list:');
      for (const item of unmatched) {
        console.log(`   - "${item.name}" (ID: ${item.node_id}, Type: ${item.type}${item.parentName ? `, Parent: ${item.parentName}` : ''})`);
      }
    } else {
      console.log(`   (See ${reportPath} for the full list of ${unmatched.length} unmatched components)`);
    }
  }

  const result = {
    total: figmaComponents.length,
    matchedCount: matched.length,
    unmatchedCount: unmatched.length,
    createdCount: toCreate.length,
    updatedCount: toUpdate.length,
    skippedCount: skipped.length,
    dryRun,
    unmatched,
    toCreate,
    toUpdate,
    skipped,
  };

  if (failOnUnmatched && unmatched.length > 0) {
    throw new Error(`Sync completed with ${unmatched.length} unmatched component(s) under strict mode.`);
  }

  return result;
}

/**
 * Main execution entry point.
 */
async function main() {
  loadEnvFiles();
  const options = parseArgs();

  if (options.help) {
    console.log(`
Usage: node scripts/sync-figma-dev-resources.js [options]

Options:
  --dry-run                 Preview create/update/skip actions without calling Figma write endpoints
  --include-variants        Include all child variant components (default: component sets and standalone components only)
  --overrides, -o <path>    Path to JSON overrides file (default: figma-storybook-overrides.json)
  --report, -r <path>       Path to output unmatched components report (default: unmatched-components.json)
  --file-key, -k <key>      Figma file key (default: FIGMA_FILE_KEY env or Carbon Design System file)
  --token, -t <token>       Figma API personal access token (default: FIGMA_API_TOKEN / FIGMA_API_KEY env)
  --storybook-url, -s <url> Storybook base URL (default: https://web-components.carbondesignsystem.com)
  --fail-on-unmatched       Exit with non-zero code if unmatched components are found (useful for CI)
  --verbose, -v             Show detailed logs for every component
  --help, -h                Show this help message
`);
    process.exit(0);
  }

  try {
    await syncFigmaDevResources(options);
    console.log('✅ Sync completed successfully.');
  } catch (err) {
    console.error(`❌ Error during sync: ${err.message}`);
    process.exit(1);
  }
}

// Only invoke main when run directly as CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main();
}
