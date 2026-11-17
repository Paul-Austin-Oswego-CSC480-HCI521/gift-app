// Keeps the mock data in step with what the backend returns.
//
// ../api-shapes.json (at the repo root) lists the fields of every response type. Back-End's
// ApiShapesTest checks it against the Java entities, so a backend change fails there first. This
// test checks the mocks used by Storybook, the unit tests and the Playwright fake server against the
// same file, so the frontend cannot keep passing against data the backend no longer sends.
//
// A mock may leave fields out (many are partial) but may not invent one. To add a field the backend
// really returns, add it to api-shapes.json (a Back-End change) and then to the mock.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { user } from "./dashboard-user.js";
import { people } from "./people.js";
import { buildPeopleWithGifts } from "./person-gifts.js";
import { preferencesRecord } from "./preferences.js";
import { wishlistItems } from "./wishlist.js";

const shapes = JSON.parse(readFileSync(resolve(process.cwd(), "../api-shapes.json"), "utf8"));

// Fields the frontend uses that the backend does not return yet. Each needs a reason, so the gap is
// visible to Back-End and the Product Owner. When the backend adds one, move it into api-shapes.json:
// the second test below fails until you delete it from this list.
const frontendOnly = {
  Gift: {
    quantity: "The add-gift modal sends a quantity, but the backend has no quantity field and ignores it.",
  },
  UserWishedItem: {
    priority: "The wish list table shows a Priority column (marked preview); the backend only stores giftName and value.",
    status: "The wish list table shows a Status column (preview); the backend does not store one.",
    added: "The wish list table shows an Added date (preview); the backend does not store one.",
  },
};

// Returns every way `value` differs from the shape named `name`.
function differences(name, value, path) {
  const shape = shapes[name];
  const problems = [];
  for (const [key, item] of Object.entries(value)) {
    const where = `${path}.${key}`;
    const type = shape[key];
    if (type === undefined) {
      if (!(key in (frontendOnly[name] ?? {}))) problems.push(`${where} is not a field the backend returns`);
    } else if (item === null || item === undefined) {
      continue;
    } else if (type === "string" || type === "number") {
      if (typeof item !== type) problems.push(`${where} should be a ${type}`);
    } else if (type.endsWith("[]")) {
      if (!Array.isArray(item)) problems.push(`${where} should be a list`);
      else item.forEach((child, index) => problems.push(...differences(type.slice(0, -2), child, `${where}[${index}]`)));
    } else {
      problems.push(...differences(type, item, where));
    }
  }
  return problems;
}

const mocks = [
  ["dashboard-user.js user", "User", [user]],
  ["people.js people", "Person", people],
  ["person-gifts.js buildPeopleWithGifts()", "Person", buildPeopleWithGifts()],
  ["preferences.js preferencesRecord", "UserAttribute", [preferencesRecord]],
  ["wishlist.js wishlistItems", "UserWishedItem", wishlistItems],
];

describe("mock data matches api-shapes.json", () => {
  it.each(mocks)("%s", (_label, name, rows) => {
    const problems = rows.flatMap((row, index) => differences(name, row, `${name}[${index}]`));
    expect(problems, "Update the mock, or api-shapes.json if the backend changed").toEqual([]);
  });

  it("lists as frontend-only only fields the backend does not return", () => {
    for (const [name, fields] of Object.entries(frontendOnly)) {
      for (const key of Object.keys(fields)) {
        expect(shapes[name], `${name} is not in api-shapes.json`).toBeDefined();
        expect(key in shapes[name], `${name}.${key} is now returned by the backend: remove it from frontendOnly`).toBe(false);
      }
    }
  });
});
