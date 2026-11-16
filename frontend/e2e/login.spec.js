import { test, expect, mockApi } from "./fixtures/index.js";

test.describe("login", () => {
  test("logs in and lands on the dashboard", async ({ page }) => {
    await page.goto("/");
    // A test id on a Carbon input is on the host element; the real <input> is inside it.
    await page.getByTestId("login-email-input").locator("input").fill("test@example.com");
    await page.getByTestId("login-password-input").locator("input").fill("password123");
    await page.getByTestId("login-submit-button").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByTestId("dashboard-people-card")).toBeVisible();
  });

  test("shows an error banner when the credentials are wrong", async ({ page }) => {
    await mockApi(page, { login: { status: 401, body: { message: "Unauthorized" } } });
    await page.goto("/");
    await page.getByTestId("login-email-input").locator("input").fill("test@example.com");
    await page.getByTestId("login-password-input").locator("input").fill("wrong-password");
    await page.getByTestId("login-submit-button").click();

    await expect(page.getByTestId("login-error-banner")).toContainText("Incorrect email or password.");
    await expect(page).toHaveURL(/\/$/);
  });

  test("keeps the user on the page and flags empty fields", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("login-submit-button").click();

    await expect(page.getByTestId("login-email-input")).toHaveAttribute("invalid", "");
    await expect(page.getByTestId("login-password-input")).toHaveAttribute("invalid", "");
  });
});
