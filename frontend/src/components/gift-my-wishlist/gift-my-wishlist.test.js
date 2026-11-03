import { afterEach, beforeAll, expect, it, vi } from "vitest";
import "./gift-my-wishlist.js";

// jsdom does not implement ResizeObserver.
beforeAll(() => vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} }));
afterEach(() => document.body.replaceChildren());

it("renders the title, preferences header and table, and passes state down to the table", async () => {
  const el = document.createElement("gift-my-wishlist");
  el.items = [{ id: 1, giftName: "Azul", value: "25.00", priority: "High", status: "Wanted" }];
  el.error = "Could not load";
  document.body.append(el);
  await el.updateComplete;

  expect(el.shadowRoot.querySelector("h1").textContent).toBe("My Wish List");
  expect(el.shadowRoot.querySelector("gift-preferences-header")).not.toBeNull();
  const table = el.shadowRoot.querySelector("gift-wishlist-table");
  expect(table.items).toHaveLength(1);
  expect(table.error).toBe("Could not load");
});

it("lets the table's wishlist-save event reach the page", async () => {
  const el = document.createElement("gift-my-wishlist");
  document.body.append(el);
  await el.updateComplete;
  const saved = vi.fn();
  el.addEventListener("wishlist-save", saved);

  el.shadowRoot.querySelector("gift-wishlist-table").dispatchEvent(
    new CustomEvent("wishlist-save", { detail: { giftName: "Azul" }, bubbles: true, composed: true }),
  );
  expect(saved).toHaveBeenCalledOnce();
});
