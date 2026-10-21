// Enforces the "Carbon first" rule from docs/carbon-conventions.md.
//
// Every custom component in src/components/<tag>/<tag>.js must either
//   1. import at least one @carbon/web-components component (it composes Carbon), or
//   2. carry a `// carbon-exempt: <reason>` comment explaining why Carbon has nothing suitable.
// Raw HTML controls that Carbon already provides (<button>, <input>, <select>, ...) are
// rejected in templates unless the file is exempt.
//
// Run: npm run lint:carbon

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/components", import.meta.url));

// Raw element -> Carbon replacement.
const RAW_TO_CARBON = {
  button: "cds-button",
  input: "cds-text-input / cds-number-input / cds-checkbox / cds-radio-button / cds-search",
  select: "cds-select / cds-dropdown",
  textarea: "cds-textarea",
  dialog: "cds-modal",
  table: "cds-table / cds-data-table",
  nav: "cds-header-nav / cds-side-nav",
  a: "cds-link (or cds-side-nav-link / cds-header-nav-item inside navigation)",
};

const MIN_REASON_LENGTH = 20;

function stripJsComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function templatesOf(source) {
  return [...source.matchAll(/html`([\s\S]*?)`/g)].map((m) => m[1]).join("\n");
}

const problems = [];
const exempted = [];

// src/components/ holds component folders (gift-*) directly, or inside group folders such as
// shared/ and feature folders. A folder not named gift-* is a group, so look inside it.
function* componentDirs(dir, relative = "") {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    const label = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.name.startsWith("gift-")) yield { name: entry.name, path, label };
    else yield* componentDirs(path, label);
  }
}

for (const dir of componentDirs(root)) {
  const file = join(dir.path, `${dir.name}.js`);
  if (!existsSync(file)) {
    problems.push(`${dir.name}: expected ${dir.label}/${dir.name}.js (component file must match its folder name)`);
    continue;
  }

  const source = readFileSync(file, "utf8");
  const label = `src/components/${dir.label}/${basename(file)}`;

  const exemption = source.match(/\/\/\s*carbon-exempt:\s*(.*)/);
  if (exemption) {
    const reason = exemption[1].trim();
    if (reason.length < MIN_REASON_LENGTH) {
      problems.push(`${label}: carbon-exempt needs a real reason (at least ${MIN_REASON_LENGTH} characters), got "${reason}"`);
    } else {
      exempted.push(`${label}: ${reason}`);
    }
    continue;
  }

  if (!/import\s+["']@carbon\/web-components\//.test(source)) {
    problems.push(
      `${label}: does not import any @carbon/web-components component. Compose Carbon components, ` +
        "or add `// carbon-exempt: <why Carbon has nothing suitable>` if that is truly not possible."
    );
  }

  const template = stripJsComments(templatesOf(source));
  for (const [tag, replacement] of Object.entries(RAW_TO_CARBON)) {
    if (new RegExp(`<${tag}[\\s>]`).test(template)) {
      problems.push(`${label}: raw <${tag}> in a template. Use ${replacement} instead.`);
    }
  }
}

if (exempted.length) {
  console.log("Carbon exemptions (reviewers: check these are justified):");
  for (const line of exempted) console.log(`  - ${line}`);
}

if (problems.length) {
  console.error("\nCarbon-first check failed:\n");
  for (const problem of problems) console.error(`  x ${problem}`);
  console.error("\nSee frontend/AGENTS.md and frontend/docs/carbon-conventions.md.");
  process.exit(1);
}

console.log("Carbon-first check passed.");
