import { test, expect, signIn } from "./fixtures/index.js";

// Dark mode: Light / Dark / System control at the bottom of the side nav. System (the default)
// follows the OS; an explicit choice is remembered in localStorage ("theme").

const body = (page) => page.locator("body");
const expectDark = async (page) => {
  await expect(body(page)).toHaveClass(/cds--g100/);
  await expect(body(page)).toHaveAttribute("data-carbon-theme", "brand-dark");
};
const expectLight = async (page) => {
  await expect(body(page)).not.toHaveClass(/cds--g100/);
  await expect(body(page)).toHaveAttribute("data-carbon-theme", "brand");
};
const tab = (page, name) => page.getByTestId("theme-switcher").getByRole("tab", { name });
const savedTheme = (page) => page.evaluate(() => localStorage.getItem("theme"));

test.describe("theme", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("follows an OS set to dark when nothing is saved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/dashboard");
    await expectDark(page);
    await expect(tab(page, "System")).toHaveAttribute("aria-selected", "true");
  });

  test("follows an OS set to light when nothing is saved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/dashboard");
    await expectLight(page);
    await expect(tab(page, "System")).toHaveAttribute("aria-selected", "true");
  });

  test("keeps a chosen theme after a reload, even against the OS setting", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/dashboard");

    await page.getByTestId("theme-switcher-dark-item").click();
    await expectDark(page);
    await expect(tab(page, "Dark")).toHaveAttribute("aria-selected", "true");
    expect(await savedTheme(page)).toBe("dark");

    await page.reload();
    await expectDark(page);
    await expect(tab(page, "Dark")).toHaveAttribute("aria-selected", "true");
  });

  test("lets a light choice win over a dark OS", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/dashboard");
    await expectDark(page);

    await page.getByTestId("theme-switcher-light-item").click();
    await expectLight(page);
    expect(await savedTheme(page)).toBe("light");
  });

  test("goes back to following the OS when System is chosen, including live changes", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/dashboard");
    await page.getByTestId("theme-switcher-dark-item").click();
    await expectDark(page);

    await page.getByTestId("theme-switcher-system-item").click();
    await expectLight(page);
    expect(await savedTheme(page)).toBeNull();

    await page.emulateMedia({ colorScheme: "dark" });
    await expectDark(page);
    await page.emulateMedia({ colorScheme: "light" });
    await expectLight(page);
  });

  test("ignores OS changes once a theme is chosen", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/dashboard");
    await page.getByTestId("theme-switcher-light-item").click();

    await page.emulateMedia({ colorScheme: "dark" });
    await expectLight(page);
  });

  test("is pinned to the bottom of the side nav, below the page links", async ({ page }) => {
    await page.goto("/dashboard");
    const lastLink = await page.getByTestId("side-nav-dates-link").boundingBox();
    const switcher = await page.getByTestId("theme-switcher").boundingBox();
    const viewportHeight = page.viewportSize().height;
    expect(switcher.y).toBeGreaterThan(lastLink.y + lastLink.height);
    // The nav panel is fixed to the viewport, so "pinned" means close to the bottom edge of it.
    expect(viewportHeight - (switcher.y + switcher.height)).toBeLessThan(48);
  });
});

test.describe("theme before the app loads", () => {
  // The inline script in the shared <head> must apply dark before first paint. Block every app
  // script so only that inline script can have set the theme, which is what stops a light flash.
  test.beforeEach(async ({ page }) => {
    await page.route("**/src/**", (route) => route.abort());
  });

  test("applies a saved dark choice without the app's JavaScript", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/dashboard");
    await expectDark(page);
  });

  test("applies a dark OS setting without the app's JavaScript", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/dashboard");
    await expectDark(page);
  });

  test("leaves the light default alone when a light choice is saved on a dark OS", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/dashboard");
    await expectLight(page);
  });
});
