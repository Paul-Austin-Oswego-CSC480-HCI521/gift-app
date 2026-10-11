import { afterEach, expect, it, vi } from "vitest";
import { within } from "@testing-library/dom";
import "./gift-side-nav.js";

afterEach(() => document.body.replaceChildren());
async function renderNav() {
  const nav = document.createElement("gift-side-nav");
  document.body.append(nav);
  await nav.updateComplete;
  return nav;
}

it("provides a named navigation landmark and all six links", async () => {
  const nav = await renderNav();
  const ui = within(nav.shadowRoot);
  expect(ui.getByRole("navigation", { name: "Gift App sidebar" })).toBeInTheDocument();
  expect(ui.getAllByRole("link").map(link => link.textContent.trim())).toEqual([
    "Dashboard", "My Wish List", "People", "Upcoming Dates", "All Gifts", "Settings",
  ]);
});

it("emits each selection without navigating to an unfinished page", async () => {
  const nav = await renderNav();
  const selected = vi.fn();
  document.body.addEventListener("side-nav-select", selected);
  const controls = [...nav.shadowRoot.querySelectorAll("a, cds-button")];
  for (const control of controls) {
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    control.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  }
  expect(selected.mock.calls.map(([event]) => event.detail.item)).toEqual([
    "dashboard", "wishlist", "people", "dates", "gifts", "add-gift", "add-recipient", "settings",
  ]);
  expect(selected.mock.calls.every(([event]) => event.bubbles && event.composed)).toBe(true);
  document.body.removeEventListener("side-nav-select", selected);
});
