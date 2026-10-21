import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { routes } from "./routes.js";

const pagesDir = join(import.meta.dirname, "../../pages");

it("has a page in pages/ for every nav route", () => {
  const missing = Object.entries(routes)
    .filter(([, route]) => route.label)
    .filter(([, route]) => !existsSync(join(pagesDir, `${route.path}.html`)))
    .map(([key]) => key);
  expect(missing).toEqual([]);
});

it("uses extensionless root-absolute paths", () => {
  for (const { path } of Object.values(routes)) {
    expect(path).toMatch(/^\/[\w-]+$/);
  }
});
