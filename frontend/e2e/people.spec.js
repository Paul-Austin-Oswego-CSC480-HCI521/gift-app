import { test, expect, signIn } from "./fixtures/index.js";

test.describe("people", () => {
  test("lists the mocked people", async ({ page }) => {
    await signIn(page);
    await page.goto("/people");

    await expect(page.getByTestId("people-heading")).toBeVisible();
    await expect(page.getByTestId("people-tile-1")).toContainText("Jaritza Lopez");
  });

  test("filters people with the search box", async ({ page }) => {
    await signIn(page);
    await page.goto("/people");
    await page.getByTestId("people-search-input").locator("input").fill("Maureen");

    await expect(page.getByTestId("people-tile-2")).toBeVisible();
    await expect(page.getByTestId("people-tile-1")).toHaveCount(0);
  });
});
