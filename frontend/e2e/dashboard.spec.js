import { test, expect, signIn } from "./fixtures/index.js";

test.describe("dashboard", () => {
  test("shows the mocked people and gifts when signed in", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard");

    await expect(page.getByTestId("dashboard-people-row-0")).toContainText("Alex Rivera");
    await expect(page.getByTestId("dashboard-people-total")).toContainText("2");
    await expect(page.getByTestId("dashboard-gifts-row-0")).toContainText("Pour-over coffee set");
  });

  test("sends a signed-out visitor to the login page", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("login-form")).toBeVisible();
  });

  test("opens the add gift modal", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard");
    await page.getByTestId("dashboard-gifts-add-button").click();
    await expect(page.getByTestId("gift-modal-name-input")).toBeVisible();
  });
});
