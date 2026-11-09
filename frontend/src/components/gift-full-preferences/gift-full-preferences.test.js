import { expect, it, afterEach, beforeAll, vi } from "vitest";
import "./gift-full-preferences.js";
import { readPreferences, serializePreference } from "./full-preferences-model.js";
beforeAll(() => vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} }));
afterEach(() => document.body.replaceChildren());
it("loads saved values, preserves legacy choices, and serializes cleared selections", () => {
  const result = readPreferences([{ attribute_Name: "Favorite Colors", value: '["Blue","Teal"]' }, { attribute_Name: "Interests", value: "Music, Art" }, { attribute_Name: "Likes", value: "Books" }]);
  expect(result["Favorite Colors"]).toEqual(["Blue", "Teal"]);
  expect(result.Interests).toEqual(["Music", "Art"]);
  expect(result.Likes).toBe("Books");
  expect(serializePreference([])).toBe("");
});
it("renders nine shared tiles and prevents saves before load or during save", async () => {
  const el = document.createElement("gift-full-preferences"); document.body.append(el); await el.updateComplete;
  expect(el.shadowRoot.querySelectorAll("gift-tile")).toHaveLength(9);
  const save = vi.fn(); el.addEventListener("preferences-save", save);
  for (const state of ["loading", "saving", "loadFailed"]) { el[state] = true; el._save(); el[state] = false; }
  expect(save).not.toHaveBeenCalled();
  el._change("Likes", "Books"); el._save();
  expect(save.mock.calls[0][0].detail.Likes).toBe("Books");
});
