/**
 * Normalizes a string by converting to lowercase, replacing punctuation/separators
 * with spaces, and collapsing whitespace.
 *
 * @param {string} str
 * @returns {string}
 */
export function normalizeName(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Strips all non-alphanumeric characters for compact comparison.
 * e.g. "Combo-Box / Large" -> "comboboxlarge"
 *
 * @param {string} str
 * @returns {string}
 */
export function toCompact(str) {
  if (!str || typeof str !== 'string') return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Splits a component name into segments based on common separators (/, -, —, |, ,).
 *
 * @param {string} name
 * @returns {string[]}
 */
export function getSegments(name) {
  if (!name || typeof name !== 'string') return [];
  return name
    .split(/[\/\-—|,:]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Selects the best story from a list of stories under the same component title.
 * Preference order:
 * 1. type === 'story' and name === 'default'
 * 2. type === 'story' and exportName === 'Default'
 * 3. first type === 'story'
 * 4. type === 'docs'
 * 5. first item
 *
 * @param {Array<object>} stories
 * @returns {object|null}
 */
export function selectBestStory(stories) {
  if (!stories || stories.length === 0) return null;

  const defaultStory = stories.find(
    s => s.type === 'story' && s.name && s.name.toLowerCase() === 'default'
  );
  if (defaultStory) return defaultStory;

  const defaultExport = stories.find(
    s => s.type === 'story' && s.exportName && s.exportName.toLowerCase() === 'default'
  );
  if (defaultExport) return defaultExport;

  const firstStory = stories.find(s => s.type === 'story');
  if (firstStory) return firstStory;

  const docsStory = stories.find(s => s.type === 'docs');
  if (docsStory) return docsStory;

  return stories[0] || null;
}

/**
 * Builds a lookup map from Storybook index.json entries.
 * Maps multiple normalized key variations (title, base component name, leaf name)
 * to the best story entry, prioritizing top-level component entries over deeply nested leaves.
 *
 * @param {object} indexJson - The parsed index.json from Storybook
 * @returns {Map<string, object>} Map of normalized keys to story entry
 */
export function buildStoryLookup(indexJson) {
  const entries = Object.values(indexJson?.entries || indexJson?.stories || {});
  const storiesByTitle = new Map();

  for (const entry of entries) {
    if (!entry || !entry.title) continue;
    if (!storiesByTitle.has(entry.title)) {
      storiesByTitle.set(entry.title, []);
    }
    storiesByTitle.get(entry.title).push(entry);
  }

  const lookup = new Map();

  // Sort titles by path depth so top-level components register their names first
  const sortedTitles = Array.from(storiesByTitle.keys()).sort((a, b) => {
    const depthA = a.split('/').length;
    const depthB = b.split('/').length;
    return depthA - depthB;
  });

  for (const title of sortedTitles) {
    const storyList = storiesByTitle.get(title);
    const bestStory = selectBestStory(storyList);
    if (!bestStory) continue;

    // Register by exact Storybook ID
    for (const story of storyList) {
      if (story.id) {
        lookup.set(`id:${story.id}`, story);
      }
    }

    // Strip category prefixes like "Components/", "Elements/", "Preview/", etc.
    const cleanTitle = title.replace(/^(components|elements|preview|layout|utilities|introduction|deprecated)\//i, '');
    const titleSegments = cleanTitle.split(/[\/\-]+/).map(s => s.trim()).filter(Boolean);

    const keysToRegister = new Set([
      normalizeName(cleanTitle),
      toCompact(cleanTitle),
      normalizeName(title),
      toCompact(title),
    ]);

    // Segment variations
    if (titleSegments.length > 0) {
      const leaf = titleSegments[titleSegments.length - 1];
      const base = titleSegments[0];
      const joined = titleSegments.join(' ');

      keysToRegister.add(normalizeName(base));
      keysToRegister.add(toCompact(base));
      keysToRegister.add(normalizeName(joined));
      keysToRegister.add(toCompact(joined));

      // Handle common singular/plural group names (e.g. Notifications/Toast -> notification toast)
      if (titleSegments.length > 1) {
        const singularGroup = base.replace(/s$/, '');
        keysToRegister.add(normalizeName(`${singularGroup} ${leaf}`));
        keysToRegister.add(toCompact(`${singularGroup} ${leaf}`));
      }

      // Add leaf name only if this is a shallow component (depth 1) or not already taken
      keysToRegister.add(normalizeName(leaf));
      keysToRegister.add(toCompact(leaf));
    }

    for (const key of keysToRegister) {
      if (key && !lookup.has(key)) {
        lookup.set(key, bestStory);
      }
    }
  }

  return lookup;
}

/**
 * Matches a Figma component to a Storybook story.
 * Supports string name or component object with `{ name, parentName }`.
 *
 * @param {string|{ name: string, parentName?: string }} component
 * @param {Map<string, object>} storyLookup - Map returned by buildStoryLookup
 * @param {Record<string, string>} [overrides={}] - Manual overrides mapping Figma name to story ID
 * @returns {{ matched: boolean, story: object|null, storyId: string|null, matchReason: string }}
 */
export function matchComponentToStory(component, storyLookup, overrides = {}) {
  const figmaName = typeof component === 'string' ? component : component?.name;
  const parentName = typeof component === 'object' ? component?.parentName : null;

  if (!figmaName || typeof figmaName !== 'string') {
    return { matched: false, story: null, storyId: null, matchReason: 'invalid_name' };
  }

  const trimmedName = figmaName.trim();

  // 1. Check manual overrides (exact name, trimmed name, normalized name)
  const overrideId =
    overrides[trimmedName] ||
    overrides[figmaName] ||
    overrides[normalizeName(trimmedName)] ||
    (parentName && (overrides[parentName.trim()] || overrides[parentName] || overrides[normalizeName(parentName)]));

  if (overrideId) {
    const overrideStory = storyLookup.get(`id:${overrideId}`);
    return {
      matched: true,
      story: overrideStory || { id: overrideId, title: trimmedName, name: 'Override' },
      storyId: overrideId,
      matchReason: 'manual_override',
    };
  }

  // 2. Try candidate keys from the Figma component name
  const segments = getSegments(trimmedName);
  const normalizedFull = normalizeName(trimmedName);
  const compactFull = toCompact(trimmedName);

  const candidateKeys = [
    { key: normalizedFull, reason: 'exact_full_name' },
    { key: compactFull, reason: 'compact_full_name' },
  ];

  if (segments.length > 0) {
    const firstSeg = segments[0];
    const leafSeg = segments[segments.length - 1];

    // Base component name (e.g. "Button" from "Button / Primary")
    candidateKeys.push({ key: normalizeName(firstSeg), reason: 'base_segment' });
    candidateKeys.push({ key: toCompact(firstSeg), reason: 'compact_base_segment' });

    // Multi-segment combinations (e.g. "Notification / Toast" -> "notification toast")
    if (segments.length > 1) {
      const combined = segments.join(' ');
      candidateKeys.push({ key: normalizeName(combined), reason: 'combined_segments' });
      candidateKeys.push({ key: toCompact(combined), reason: 'compact_combined_segments' });

      // First + leaf
      const firstAndLeaf = `${firstSeg} ${leafSeg}`;
      candidateKeys.push({ key: normalizeName(firstAndLeaf), reason: 'first_and_leaf_segments' });
      candidateKeys.push({ key: toCompact(firstAndLeaf), reason: 'compact_first_and_leaf_segments' });

      // Leaf segment
      candidateKeys.push({ key: normalizeName(leafSeg), reason: 'leaf_segment' });
      candidateKeys.push({ key: toCompact(leafSeg), reason: 'compact_leaf_segment' });
    }
  }

  // 3. Fall back to parent name if this component is a child variant inside a COMPONENT_SET
  if (parentName && typeof parentName === 'string') {
    const parentTrimmed = parentName.trim();
    candidateKeys.push({ key: normalizeName(parentTrimmed), reason: 'parent_component_set_name' });
    candidateKeys.push({ key: toCompact(parentTrimmed), reason: 'compact_parent_component_set_name' });

    const parentSegments = getSegments(parentTrimmed);
    if (parentSegments.length > 0) {
      candidateKeys.push({ key: normalizeName(parentSegments[0]), reason: 'parent_base_segment' });
      candidateKeys.push({ key: toCompact(parentSegments[0]), reason: 'compact_parent_base_segment' });
    }
  }

  for (const { key, reason } of candidateKeys) {
    if (key && storyLookup.has(key)) {
      const story = storyLookup.get(key);
      return {
        matched: true,
        story,
        storyId: story.id,
        matchReason: reason,
      };
    }
  }

  return {
    matched: false,
    story: null,
    storyId: null,
    matchReason: 'no_match',
  };
}
