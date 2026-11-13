// Checks that pictograms come from the Carbon package and are not hand-made or pasted in.
//
// Rules (errors):
//   1. Anything imported from @carbon/pictograms must be a single pictogram module,
//      `@carbon/pictograms/es/<name>` (with or without `/index.js`), and <name> must exist in the installed package.
//      Not the package root, `lib/`, `svg/`, or another pictogram package.
//   2. No imported or referenced .svg files (`import x from "./thing.svg"`, `<img src="...svg">`).
//      Use a Carbon pictogram (@carbon/pictograms) or icon (@carbon/icons) instead. If Figma has a
//      pictogram, find it in the package by its layer name (e.g. `birthday--cake`).
//
//   3. Every pictogram rendered with iconLoader must say what it is to assistive tech: either
//      `"aria-hidden": "true"` (decorative, the meaning is in nearby text or on its container, such
//      as a button's tooltip-content) or an `aria-label`. A pictogram with neither is announced
//      inconsistently, so it fails.
//
// Warning only: inline `<svg>` markup in a template is listed so it can be replaced, but does not
// fail the check (some, like the brand logo, are legitimately not Carbon).
//
// Run: npm run lint:carbon

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const frontend = fileURLToPath(new URL("..", import.meta.url));
const pictogramDir = join(frontend, "node_modules/@carbon/pictograms/es");
const SCAN = ["src", "stories", ".storybook"];
const PICTOGRAM_IMPORT = /^@carbon\/pictograms\/es\/([a-z0-9-]+)(?:\/index\.js)?$/;

function* sourceFiles(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry !== "node_modules") yield* sourceFiles(path);
    } else if (/\.(js|mjs)$/.test(entry)) {
      yield path;
    }
  }
}

function stripJsComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const problems = [];
const inlineSvg = [];

if (!existsSync(pictogramDir)) {
  problems.push("@carbon/pictograms is not installed. Run `npm install`.");
}

for (const file of SCAN.flatMap((dir) => [...sourceFiles(join(frontend, dir))])) {
  const label = relative(frontend, file);
  const source = stripJsComments(readFileSync(file, "utf8"));

  const pictogramNames = [
    ...source.matchAll(/import\s+(\w+)\s+from\s*["']@carbon\/pictograms\/es\/[^"']+["']/g),
  ].map((m) => m[1]);

  for (const name of pictogramNames) {
    for (const call of source.matchAll(new RegExp(`iconLoader\\(\\s*${name}\\s*(?:,\\s*\\{([\\s\\S]*?)\\})?\\s*\\)`, "g"))) {
      if (!/["']?aria-(hidden|label)["']?\s*:/.test(call[1] ?? "")) {
        problems.push(
          `${label}: pictogram ${name} is rendered without "aria-hidden": "true" (decorative) or an aria-label. ` +
            "Decide which, and put the name on its container if the pictogram is the only content."
        );
      }
    }
  }

  const specifiers = [...source.matchAll(/(?:from\s*|import\s*\(?\s*|import\s+)["']([^"']+)["']/g)].map((m) => m[1]);

  for (const specifier of specifiers) {
    if (specifier.startsWith("@carbon/pictograms")) {
      const match = specifier.match(PICTOGRAM_IMPORT);
      if (!match) {
        problems.push(
          `${label}: import "${specifier}" must be a single pictogram, e.g. ` +
            `"@carbon/pictograms/es/birthday--cake/index.js". Never import the package root or another path.`
        );
      } else if (existsSync(pictogramDir) && !existsSync(join(pictogramDir, match[1], "index.js"))) {
        problems.push(`${label}: "${match[1]}" is not a pictogram in @carbon/pictograms. Check the name in node_modules/@carbon/pictograms/es/.`);
      }
    } else if (/\.svg(\?.*)?$/.test(specifier)) {
      problems.push(
        `${label}: imports "${specifier}". Use a pictogram from @carbon/pictograms (or an icon from @carbon/icons) ` +
          "instead of an exported SVG file."
      );
    }
  }

  if (/<img\b[^>]*\.svg/.test(source)) {
    problems.push(`${label}: <img> pointing at an .svg file. Use a pictogram from @carbon/pictograms with iconLoader.`);
  }

  if (/<svg[\s>]/.test(source)) inlineSvg.push(label);
}

if (inlineSvg.length) {
  console.log("Inline <svg> markup (not checked; replace with @carbon/pictograms or @carbon/icons where Carbon has one):");
  for (const label of inlineSvg) console.log(`  - ${label}`);
}

if (problems.length) {
  console.error("\nPictogram check failed:\n");
  for (const problem of problems) console.error(`  x ${problem}`);
  console.error("\nSee the pictograms section of frontend/AGENTS.md.");
  process.exit(1);
}

console.log("Pictogram check passed.");
