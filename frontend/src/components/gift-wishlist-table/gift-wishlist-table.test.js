import { afterEach, beforeAll, expect, it, vi } from "vitest";
import "./gift-wishlist-table.js";
// Match the existing modal tests: jsdom does not implement ResizeObserver.
beforeAll(() => vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} }));
afterEach(() => document.body.replaceChildren());
async function setup() {
  const host = document.createElement("gift-wishlist-table");
  host.items = Array.from({ length: 9 }, (_, i) => ({ id: i + 1, giftName: `Item ${i + 1}`, value: "10.00", priority: i % 2 ? "Low" : "High", status: "Wanted" }));
  document.body.append(host); await host.updateComplete; return host;
}
it("renders seven rows and combines search with priority/status filters", async () => {
  const host = await setup();
  expect(host.shadowRoot.querySelectorAll("cds-table-row")).toHaveLength(7);
  host._query = "Item 1"; host._filters = ["High", "Wanted"];
  expect(host.filteredItems.map(row => row.id)).toEqual([1]);
  host._filters = ["Low"];
  expect(host.filteredItems).toEqual([]);
});
it("clamps pagination when results shrink", async () => {
  const host = await setup(); host._page = 2; await host.updateComplete;
  expect(host.shadowRoot.querySelectorAll("cds-table-row")).toHaveLength(2);
  host.items = host.items.slice(0, 1); await host.updateComplete;
  expect(host.shadowRoot.querySelectorAll("cds-table-row")).toHaveLength(1);
});
it("validates required names and prices and blocks saving twice", async () => {
  const host = await setup(); const saved = vi.fn(); host.addEventListener("wishlist-save", saved);
  host._edit(); await host.updateComplete; host._submit();
  expect(saved).not.toHaveBeenCalled();
  for (const value of ["-1", "NaN", "3.141", "1e2", ""]) {
    host._draft = { ...host._draft, giftName: "Game", value }; host._submit();
  }
  expect(saved).not.toHaveBeenCalled();
  host._draft = { ...host._draft, giftName: " Game ", value: "0.00" }; host._submit();
  expect(saved.mock.calls[0][0].detail).toMatchObject({ giftName: "Game", value: "0.00" });
  host.saving = true; host._submit(); host.closeEditor();
  expect(saved).toHaveBeenCalledTimes(1); expect(host._draft).not.toBeNull();
});
it("edits a copy and cancel leaves the original item unchanged", async () => {
  const host = await setup(); host._edit(host.items[0]);
  host._draft.giftName = "Changed";
  expect(host.items[0].giftName).toBe("Item 1");
  host.closeEditor(); expect(host._draft).toBeNull();
});
