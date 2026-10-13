// Checks that attributes used on <cds-*> elements in templates are ones Carbon's web
// components actually declare, using the manifest that ships with the package
// (node_modules/@carbon/web-components/custom-elements.json). Catches silent mistakes such as
// `is-active` on <cds-side-nav-link> (the attribute there is `active`), which render fine but
// do nothing.
//
// Also enforces a few Carbon accessibility requirements (REQUIRED below).
//
// Run: npm run lint:carbon-attrs

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const frontend = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(
  readFileSync(join(frontend, "node_modules/@carbon/web-components/custom-elements.json"), "utf8")
);
const declared = new Map(manifest.tags.map((tag) => [tag.name, new Set((tag.attributes || []).map((a) => a.name))]));

// Valid on any element. aria-* and data-* are always allowed.
const GLOBAL_ATTRIBUTES = new Set([
  "class", "id", "slot", "style", "part", "hidden", "tabindex", "title", "role", "lang", "dir",
  "draggable", "translate", "inert", "autofocus", "name", "value", "disabled", "ref",
]);

// Real attributes missing from the manifest (verified against the component source in
// node_modules/@carbon/web-components/es). Add an entry only after checking the source.
const MANIFEST_GAPS = {
  "cds-table-row": ["expandable"],
};

// Accessibility attributes Carbon expects the consumer to supply. Each entry is a list of
// alternatives; at least one must be present.
const REQUIRED = {
  "cds-side-nav": [["aria-label", "aria-labelledby"]],
  "cds-header-nav": [["aria-label", "aria-labelledby", "menu-bar-label"]],
};

const SKIP_DIRS = new Set(["node_modules", "dist", "coverage", "storybook-static"]);

function* sourceFiles(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* sourceFiles(full);
    else if (/\.js$/.test(entry) && !/\.test\.js$/.test(entry)) yield full;
  }
}

function templatesOf(source) {
  return [...source.matchAll(/html`([\s\S]*?)`/g)].map((m) => m[1]);
}

// Reads one start tag beginning at `i` (just after "<"), skipping over quoted values and
// ${...} expressions so a ">" inside them does not end the tag early.
function readTag(text, start) {
  let i = start;
  let quote = null;
  let depth = 0;
  while (i < text.length) {
    const c = text[i];
    if (depth > 0) {
      if (c === "{") depth++;
      else if (c === "}") depth--;
    } else if (quote) {
      if (c === quote) quote = null;
      else if (c === "$" && text[i + 1] === "{") { depth = 1; i++; }
    } else if (c === '"' || c === "'") quote = c;
    else if (c === "$" && text[i + 1] === "{") { depth = 1; i++; }
    else if (c === ">") return text.slice(start, i);
    i++;
  }
  return text.slice(start);
}

function attributeNames(tagText) {
  // Drop quoted values and ${...} expressions, leaving only names and "=" markers.
  const stripped = tagText
    .replace(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g, "")
    .replace(/"[^"]*"|'[^']*'/g, '""');
  return [...stripped.matchAll(/(?:^|\s)([@.?]?[A-Za-z_][\w:.-]*)/g)].map((m) => m[1]);
}

function suggestion(name, valid) {
  const bare = name.replace(/^is-/, "");
  if (valid.has(bare)) return ` Did you mean "${bare}"?`;
  if (valid.has(`is-${name}`)) return ` Did you mean "is-${name}"?`;
  return "";
}

const problems = [];

const htmlPages = readdirSync(frontend).filter((f) => f.endsWith(".html")).map((f) => join(frontend, f));
const files = [...sourceFiles(join(frontend, "src")), ...sourceFiles(join(frontend, "stories")), ...htmlPages];

for (const file of files) {
  const label = relative(frontend, file);
  const text = readFileSync(file, "utf8");
  for (const template of file.endsWith(".html") ? [text] : templatesOf(text)) {
    for (const match of template.matchAll(/<(cds-[a-z0-9-]+)/g)) {
      const tag = match[1];
      const valid = declared.get(tag);
      if (!valid) {
        problems.push(`${label}: <${tag}> is not a Carbon web component (check the tag name).`);
        continue;
      }
      const names = attributeNames(readTag(template, match.index + 1 + tag.length)).map((n) => n.replace(/^\?/, ""));

      for (const name of names) {
        if (name.startsWith("@") || name.startsWith(".")) continue; // event / property bindings
        if (name.startsWith("aria-") || name.startsWith("data-")) continue;
        if (valid.has(name) || GLOBAL_ATTRIBUTES.has(name)) continue;
        if (MANIFEST_GAPS[tag]?.includes(name)) continue;
        problems.push(`${label}: <${tag}> has unknown attribute "${name}".${suggestion(name, valid)}`);
      }

      for (const alternatives of REQUIRED[tag] || []) {
        if (!alternatives.some((a) => names.includes(a))) {
          problems.push(`${label}: <${tag}> needs ${alternatives.map((a) => `"${a}"`).join(" or ")} (Carbon accessibility requirement).`);
        }
      }
    }
  }
}

if (problems.length) {
  console.error("\nCarbon attribute check failed:\n");
  for (const problem of problems) console.error(`  x ${problem}`);
  console.error(
    "\nAttribute names come from the Carbon web components manifest, which can differ per element" +
      "\n(e.g. cds-side-nav-link uses `active`, cds-header-nav-item uses `is-active`)." +
      "\nSee frontend/AGENTS.md."
  );
  process.exit(1);
}

console.log("Carbon attribute check passed.");
