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
  const active = [...nav.querySelectorAll("cds-side-nav-link")].filter((link) => link.hasAttribute("active"));
  expect(active.map((link) => link.textContent.trim())).toEqual(["People"]);
});

it("keeps decorative icons out of the accessibility tree", async () => {
  const nav = await renderNav();
  const icons = nav.querySelectorAll("svg");
  expect(icons.length).toBeGreaterThan(0);
  icons.forEach((icon) => expect(icon).toHaveAttribute("aria-hidden", "true"));
});

it("navigates to the correct page when clicked", async () => {
  const nav = await renderNav();

  // Mock window.location so it doesn't try to actually redirect during the test
  const originalLocation = window.location;
  delete window.location;
  window.location = { href: "" };

  const controls = [...nav.querySelectorAll("cds-side-nav-link, cds-button")];

  // Expected HTML file routes matching your component's navigation mapping
  const expectedRoutes = [
    "dashboard.html",
    "my-wishlist.html",
    "people.html",
    "upcoming-dates.html",
    "all-gifts.html",
    "settings.html",
    "add-gift.html",
    "add-recipient.html"
  ];

  for (let i = 0; i < controls.length; i++) {
    const control = controls[i];
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    control.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(window.location.href).toBe(expectedRoutes[i]);
  }

  // Restore original window location object
  window.location = originalLocation;
});
