import { expect, it, afterEach, beforeAll, vi } from "vitest";
import "./gift-full-preferences.js";
import { readPreferences, serializePreferences } from "./full-preferences-model.js";
beforeAll(() => vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} }));
afterEach(() => document.body.replaceChildren());
it("maps the new backend fields to editable strings and back", () => {
  const result = readPreferences({ favoriteColor: "Teal and copper", preferredFit: "Loose", styleDescription: "Vintage", interests: "Pottery", likes: null });
  expect(result["Favorite Colors"]).toBe("Teal and copper");
  expect(result["Preferred Fit"]).toBe("Loose");
  expect(result.Likes).toBe("");
  expect(serializePreferences(result)).toMatchObject({ favoriteColor: "Teal and copper", preferredFit: "Loose", styleDescription: "Vintage", interests: "Pottery" });
  expect(readPreferences(null)["Favorite Colors"]).toBe("");
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
