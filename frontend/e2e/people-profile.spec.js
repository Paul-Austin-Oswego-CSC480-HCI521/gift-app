import { test, expect, signIn, mockApi } from "./fixtures/index.js";

test("person page functionality", async ({ page }) => {
  // calls lists every API request the page makes, in case a test needs to check one
  const { calls } = await mockApi(page);
  await signIn(page);
  await page.goto("/people");
  await page.getByRole("link", { name: "Jaritza Lopez" }).click();
  await page.getByRole("textbox", { name: "Search wish list" }).click();
  await page.getByRole("textbox", { name: "Search wish list" }).fill("boots");
  await page.getByRole("button", { name: "Clear search" }).click();
  await page
    .getByTestId("wishlist-filter-toggle-button")
    .locator("svg")
    .click();
  await page
    .getByTestId("wishlist-filter-status-wanted-checkbox")
    .locator("label")
    .click();
  await page
    .getByTestId("wishlist-filter-status-wanted-checkbox")
    .locator("label")
    .check();
  await page.locator("gift-people-profile").click();
  await page.getByRole("button", { name: "Filter wish list" }).click();
  await page
    .getByTestId("wishlist-filter-toggle-button")
    .locator("svg")
    .click();
  await page
    .getByTestId("wishlist-filter-status-wanted-checkbox")
    .locator("label")
    .click();
  await page
    .getByTestId("wishlist-filter-status-wanted-checkbox")
    .locator("label")
    .check();
  await page.getByRole("button", { name: "Apply" }).click();
});
