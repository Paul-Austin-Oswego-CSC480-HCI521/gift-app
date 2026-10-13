import { afterEach, expect, it, vi } from "vitest";
import "./gift-side-nav.js";

afterEach(() => document.body.replaceChildren());
async function renderNav(attrs = "") {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `<gift-side-nav ${attrs}></gift-side-nav>`;
  document.body.append(wrapper);
  const nav = wrapper.querySelector("gift-side-nav");
  await nav.updateComplete;
  return nav;
}

const labels = (nav) =>
  [...nav.querySelectorAll("cds-side-nav-link")].map((link) => link.textContent.trim());

it("is built on Carbon's side nav with an accessible name and all six links", async () => {
  const nav = await renderNav();
  expect(nav.querySelector("cds-side-nav")).toHaveAttribute("aria-label", "Gift App sidebar");
  expect(labels(nav)).toEqual([
    "Dashboard", "My Wish List", "People", "Upcoming Dates", "All Gifts", "Settings",
  ]);
});

it("marks the active link", async () => {
  const nav = await renderNav('active="people"');
  const active = [...nav.querySelectorAll("cds-side-nav-link")].filter((link) => link.hasAttribute("is-active"));
  expect(active.map((link) => link.textContent.trim())).toEqual(["People"]);
});

it("keeps decorative icons out of the accessibility tree", async () => {
  const nav = await renderNav();
  const icons = nav.querySelectorAll("svg");
  expect(icons.length).toBeGreaterThan(0);
  icons.forEach((icon) => expect(icon).toHaveAttribute("aria-hidden", "true"));
});

it("emits each selection without navigating to an unfinished page", async () => {
  const nav = await renderNav();
  const selected = vi.fn();
  document.body.addEventListener("side-nav-select", selected);
  const controls = [...nav.querySelectorAll("cds-side-nav-link, cds-button")];
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
