import { defineConfig, devices } from "@playwright/test";

// Live end-to-end tests: they talk to the REAL backend and database, so they are run by hand
// (npm run test:e2e:live), never in CI. See e2e-live/README.md and the folder rules in
// e2e/README.md. This is a separate config on purpose: playwright.config.js only looks in ./e2e.
//
// No webServer here. The tests open a deployed site (or a frontend you started yourself).
export default defineConfig({
  testDir: "./e2e-live",
  testMatch: "**/*.spec.js",
  globalSetup: "./e2e-live/global-setup.js",
  // One at a time: the tests share one test account and one database.
  fullyParallel: false,
  workers: 1,
  // A retry would hide the real reason a live test failed, and could repeat a write.
  retries: 0,
  // The server can be slow even when awake.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  forbidOnly: true,
  reporter: [["list"], ["html", { outputFolder: "playwright-report-live", open: "never" }]],
  outputDir: "test-results-live",
  use: {
    baseURL: process.env.LIVE_BASE_URL ?? "https://gift-app-project.netlify.app",
    testIdAttribute: "data-testid",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
