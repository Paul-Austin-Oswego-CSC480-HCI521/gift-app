// Checks the data-testid hooks that Playwright tests rely on (see docs/carbon-conventions.md,
// "Test hooks"). Fails on:
//   - an id that is not lowercase kebab-case (${...} parts are allowed in templates)
//   - the same static id used twice in one file (Playwright strict mode needs unique hooks)
//
// Run: npm run lint:test-ids  (also part of npm run lint:carbon)

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const frontend = fileURLToPath(new URL("..", import.meta.url));
const SKIP_DIRS = new Set(["node_modules", "dist", "coverage", "storybook-static", "e2e", "stories"]);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function* files(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* files(full);
    else if (/\.(js|html)$/.test(entry) && !/\.(test|stories)\.js$/.test(entry)) yield full;
  }
}

const problems = [];
let total = 0;
for (const dir of ["src", "pages"]) {
  for (const file of files(join(frontend, dir))) {
    const seen = new Map();
    for (const [, id] of readFileSync(file, "utf8").matchAll(/data-testid="([^"]*)"/g)) {
      total += 1;
      const rel = relative(frontend, file);
      const dynamic = id.includes("${");
      if (!KEBAB.test(id.replace(/\$\{[^}]*\}/g, "x"))) problems.push(`${rel}: "${id}" is not lowercase kebab-case`);
      if (!dynamic && seen.has(id)) problems.push(`${rel}: "${id}" is used more than once in this file`);
      seen.set(id, true);
    }
  }
}

if (problems.length) {
  console.error("Test id check failed:\n" + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`Test id check passed (${total} data-testid hooks).`);
