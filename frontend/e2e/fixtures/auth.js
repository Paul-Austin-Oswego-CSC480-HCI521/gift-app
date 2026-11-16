// Signed-in state. The app keeps its token in sessionStorage (src/auth/token-store.js), so tests
// that are not about logging in can skip the login page by seeding the same two keys.
import { TEST_TOKEN, TEST_USER_ID } from "./api.js";

export async function signIn(page) {
  await page.addInitScript(
    ({ token, userId }) => {
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("userId", String(userId));
    },
    { token: TEST_TOKEN, userId: TEST_USER_ID },
  );
}
