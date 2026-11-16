// Import { test, expect } from here, not from @playwright/test. Every test then gets a mocked API
// (page.route handlers) and can call signIn(page) when it needs a logged-in user.
import { test as base, expect } from "@playwright/test";
import { mockApi } from "./api.js";
import { signIn } from "./auth.js";

export const test = base.extend({
  page: async ({ page }, use) => {
    await mockApi(page);
    await use(page);
  },
});

export { expect, signIn, mockApi };
