// Real-backend smoke run (the SVT-style check). Real login against the live backend; no mocks.
// Run by hand at 8pm EST with: npm run test:e2e:live
import { test, expect } from "@playwright/test";
import { liveCredentials } from "./credentials.js";

test.describe("live smoke", () => {
  test("logs in with the shared test account and reaches the dashboard", async ({ page }) => {
    const { email, password } = liveCredentials();
    await page.goto("/");
    // A test id on a Carbon input is on the host element; the real <input> is inside it.
    await page.getByTestId("login-email-input").locator("input").fill(email);
    await page.getByTestId("login-password-input").locator("input").fill(password);
    await page.getByTestId("login-submit-button").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  // Next step for a developer: add a gift, then see it on the dashboard. It needs the reset and
  // cleanup procedure from issue #73 so the shared account stays reusable. Record the steps with
  // `npm run record:live` and clean up the gift at the end of the test.
  test.fixme("adds a gift and sees it on the dashboard", async () => {});
});
