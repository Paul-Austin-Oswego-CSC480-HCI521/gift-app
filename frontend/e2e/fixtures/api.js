// Mocked backend for e2e tests. Responses reuse the Storybook mock data in src/mocks/, so the
// stories and the e2e tests describe the same people and gifts.
import { user } from "../../src/mocks/dashboard-user.js";
import { people } from "../../src/mocks/people.js";

export const TEST_USER_ID = 1;
export const TEST_TOKEN = "test-token";

const json = (route, body, status = 200) =>
  route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

/**
 * Registers mocked API routes on a page. Call it before page.goto().
 * Pass overrides to change a response, for example { login: { status: 401 } }.
 */
export async function mockApi(page, overrides = {}) {
  await page.route("**/auth/login", (route) => {
    const { status = 200, body = { token: TEST_TOKEN, userId: TEST_USER_ID } } = overrides.login ?? {};
    return json(route, body, status);
  });
  await page.route(/\/user\/\d+\/person$/, (route) => json(route, overrides.people ?? people));
  await page.route(/\/user\/\d+$/, (route) => json(route, overrides.user ?? user));
}
