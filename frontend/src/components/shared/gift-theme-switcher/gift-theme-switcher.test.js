import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { THEME_KEY, setPreference } from "../../../theme/theme.js";
import "./gift-theme-switcher.js";

beforeEach(() => {
  localStorage.clear();
  document.body.className = "";
  delete document.body.dataset.carbonTheme;
  window.matchMedia = vi.fn(() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => document.body.replaceChildren());

async function renderSwitcher() {
  const switcher = document.createElement("gift-theme-switcher");
  document.body.append(switcher);
  await switcher.updateComplete;
  return switcher;
}

const item = (switcher, value) => switcher.querySelector(`[value="${value}"]`);
const picked = (switcher) =>
  [...switcher.querySelectorAll("cds-content-switcher-item")].find((i) => i.selected)?.getAttribute("value");

it("is built on Carbon's content switcher with an accessible name and the three options", async () => {
  const switcher = await renderSwitcher();
  expect(switcher.querySelector("cds-content-switcher")).toHaveAttribute("aria-label", "Color theme");
  const labels = [...switcher.querySelectorAll("cds-content-switcher-item")].map((i) => i.textContent.trim());
  expect(labels).toEqual(["Light", "Dark", "System"]);
});

it("starts on System when nothing is saved", async () => {
  expect(picked(await renderSwitcher())).toBe("system");
});

it("starts on the saved choice", async () => {
  localStorage.setItem(THEME_KEY, "dark");
  expect(picked(await renderSwitcher())).toBe("dark");
});

it("sets the preference when an option is chosen", async () => {
  const switcher = await renderSwitcher();
  item(switcher, "dark").dispatchEvent(new MouseEvent("click", { bubbles: true }));
  expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  expect(document.body.dataset.carbonTheme).toBe("brand-dark");
});

it("follows the theme when it is changed elsewhere", async () => {
  const switcher = await renderSwitcher();
  setPreference("light");
  await switcher.updateComplete;
  await switcher.querySelector("cds-content-switcher").updateComplete;
  expect(picked(switcher)).toBe("light");
});
