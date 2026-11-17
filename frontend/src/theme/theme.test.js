import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  THEME_CHANGE_EVENT,
  THEME_KEY,
  applyTheme,
  getPreference,
  resolveTheme,
  setPreference,
  watchSystemTheme,
} from "./theme.js";

// jsdom has no matchMedia, so fake one whose result the tests control.
let systemDark;
let listeners;
function mockSystem(dark) {
  systemDark = dark;
  listeners = new Set();
  window.matchMedia = vi.fn(() => ({
    get matches() {
      return systemDark;
    },
    addEventListener: (_type, fn) => listeners.add(fn),
    removeEventListener: (_type, fn) => listeners.delete(fn),
  }));
}
const flipSystem = (dark) => {
  systemDark = dark;
  listeners.forEach((fn) => fn());
};

const isDark = () =>
  document.body.classList.contains("cds--g100") && document.body.dataset.carbonTheme === "brand-dark";
const isLight = () =>
  !document.body.classList.contains("cds--g100") && document.body.dataset.carbonTheme === "brand";

beforeEach(() => {
  localStorage.clear();
  document.body.className = "";
  delete document.body.dataset.carbonTheme;
  mockSystem(false);
});
afterEach(() => vi.restoreAllMocks());

it("defaults to following the system when nothing is saved", () => {
  expect(getPreference()).toBe("system");
  mockSystem(true);
  expect(resolveTheme()).toBe("dark");
  mockSystem(false);
  expect(resolveTheme()).toBe("light");
});

it("ignores a saved value it does not recognise", () => {
  localStorage.setItem(THEME_KEY, "purple");
  expect(getPreference()).toBe("system");
});

it("applies dark as both the cds--g100 class and the brand-dark attribute", () => {
  setPreference("dark");
  expect(isDark()).toBe(true);
  expect(document.documentElement.style.colorScheme).toBe("dark");
});

it("applies light as the brand attribute with no dark class", () => {
  setPreference("dark");
  setPreference("light");
  expect(isLight()).toBe(true);
});

it("lets an explicit choice win over the system setting", () => {
  mockSystem(true);
  setPreference("light");
  expect(applyTheme()).toBe("light");
  expect(isLight()).toBe(true);
});

it("stores light and dark, and clears the key for system", () => {
  setPreference("dark");
  expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  setPreference("system");
  expect(localStorage.getItem(THEME_KEY)).toBeNull();
  expect(getPreference()).toBe("system");
});

it("rejects an unknown preference without changing anything", () => {
  setPreference("dark");
  expect(setPreference("purple")).toBe("dark");
  expect(getPreference()).toBe("dark");
});

it("announces a change so the switcher can stay in sync", () => {
  const seen = vi.fn();
  window.addEventListener(THEME_CHANGE_EVENT, seen);
  setPreference("dark");
  window.removeEventListener(THEME_CHANGE_EVENT, seen);
  expect(seen).toHaveBeenCalledOnce();
  expect(seen.mock.calls[0][0].detail).toEqual({ preference: "dark" });
});

it("still applies the theme when storage is unavailable", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  expect(getPreference()).toBe("system");
  expect(() => setPreference("dark")).not.toThrow();
  expect(isDark()).toBe(true);
});

it("follows OS changes while on system, and stops once the user picks a theme", () => {
  const stop = watchSystemTheme();
  flipSystem(true);
  expect(isDark()).toBe(true);
  flipSystem(false);
  expect(isLight()).toBe(true);

  setPreference("dark");
  flipSystem(false);
  expect(isDark()).toBe(true);

  stop();
  expect(listeners.size).toBe(0);
});
