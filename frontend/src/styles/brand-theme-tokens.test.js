import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

// A token that only the dark block defines leaks into a light theme nested inside a dark one
// (Storybook's themed wrapper inside a dark <body>): the light block must define it too, so the
// nested light theme resets it. This is how the dark tile background once stuck after switching back.
// A plain path, not new URL(..., import.meta.url), which Vite rewrites into an asset URL.
const read = (name) => readFileSync(resolve(process.cwd(), "src/styles", name), "utf8");
const block = (css, selector) => {
  const start = css.indexOf(`${selector} {`);
  expect(start, `${selector} block not found`).toBeGreaterThan(-1);
  return css.slice(start, css.indexOf("\n}", start));
};
const customProperties = (css) => new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

it("defines every --tile-* and --card-* token the dark theme sets in the light theme too", () => {
  const light = customProperties(block(read("brand-theme.css"), ':root [data-carbon-theme="brand"]'));
  const dark = customProperties(block(read("brand-theme-dark.css"), ':root [data-carbon-theme="brand-dark"]'));
  const brandOnly = [...dark].filter((name) => /^--(tile|card)-/.test(name));
  expect(brandOnly.length).toBeGreaterThan(0);
  const missing = brandOnly.filter((name) => !light.has(name));
  expect(missing).toEqual([]);
});
