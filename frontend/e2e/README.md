# End-to-end tests (Playwright)

Browser tests that click through the real pages the way a user would. They run against the Vite dev
server with the **API mocked**, so you do not need the Java backend, a database or any secrets.

## Run them

```bash
cd frontend
npx playwright install chromium   # once, downloads the browser
npm run test:e2e                  # run everything, headless (starts the dev server for you)
npm run test:e2e:ui               # UI mode: pick tests, watch them run, time-travel through steps
npx playwright test login         # only files matching "login"
npx playwright test --headed      # watch a real browser window
npx playwright codegen http://localhost:5173   # record clicks and get locator suggestions
npx playwright show-report        # open the HTML report from the last run
```

If a test fails in CI, download the `playwright-report` artifact from the run and open
`index.html`. Failed-then-retried tests include a trace you can step through.

## Folder layout

```
e2e/
  fixtures/
    index.js   import { test, expect, signIn, mockApi } from here
    api.js     mocked backend routes (reuses the Storybook data in src/mocks/)
    auth.js    signIn(page): seeds the login token so you can skip the login page
  login.spec.js
  dashboard.spec.js
```

Put new tests in `e2e/<feature>.spec.js`. Import `test` and `expect` from `./fixtures/index.js`
(not from `@playwright/test`) so every test gets the mocked API automatically.

## Finding elements: role/label first, test id as the fallback

1. **Role or label** when the accessible name is stable: `page.getByRole("link", { name: "People" })`,
   `page.getByLabel("Email")`. Playwright sees through open shadow roots, so this works with Carbon.
2. **`data-testid`** for everything else: repeated items (rows, cards, tiles), banners and loading or
   empty states, the modal, icon-only buttons. `page.getByTestId("people-add-button")`.

The naming rules and the full list of rules live in
[Test hooks](../docs/carbon-conventions.md#test-hooks-data-testid). Some examples:
`login-submit-button`, `wishlist-row-12`, `dashboard-people-card`, `people-error-banner`.

### Gotcha: typing into Carbon inputs

A test id on `<cds-text-input>` is on the outer element. The real `<input>` is inside it, so reach in:

```js
await page.getByTestId("login-email-input").locator("input").fill("test@example.com");
```

For checks like "is this field showing an error", look at the outer element's attribute:
`await expect(page.getByTestId("login-email-input")).toHaveAttribute("invalid", "")`.

If a test id you need is missing, add it in the component (see the conventions) rather than selecting by
CSS class or text. Do not rename an existing id without checking which tests use it.

## Mocking the API

`mockApi(page)` already runs for every test and returns the Storybook data: the user from
`src/mocks/dashboard-user.js` and the people from `src/mocks/people.js`. To change a response for one test:

```js
import { test, expect, mockApi } from "./fixtures/index.js";

test("shows the error banner when login fails", async ({ page }) => {
  await mockApi(page, { login: { status: 401, body: {} } });
  // ...
});
```

Call it **before** `page.goto()`. To mock another endpoint, add a `page.route(...)` in
`fixtures/api.js` (and add its data to `src/mocks/` so Storybook can use it too).

## Being signed in

The app stores its token in `sessionStorage`. Most tests do not need to test logging in, so:

```js
import { test, expect, signIn } from "./fixtures/index.js";

test("my page", async ({ page }) => {
  await signIn(page);        // before goto
  await page.goto("/people");
});
```

Visiting a logged-in page without `signIn` redirects to `/`, which `dashboard.spec.js` checks.

## Your first test (walkthrough)

Goal: check that the People page shows the mocked people.

1. Create `e2e/people.spec.js`.
2. Import the fixtures and sign in:
   ```js
   import { test, expect, signIn } from "./fixtures/index.js";

   test("lists the mocked people", async ({ page }) => {
     await signIn(page);
     await page.goto("/people");
   ```
3. Assert on what a user sees. Find the hooks by searching the component for `data-testid`
   (`src/components/gift-people/gift-people.js`) or by using `codegen`:
   ```js
     await expect(page.getByTestId("people-heading")).toBeVisible();
     await expect(page.getByTestId("people-tile-1")).toContainText("Jaritza Lopez");
   });
   ```
4. Run it with `npx playwright test people --headed`, or open UI mode.

Copy `login.spec.js` if you want a form example.

## What is not covered here

These tests do not talk to the real backend. Real-backend end-to-end runs (Liberty plus a seeded test
database) are a possible later step. Unit tests and Storybook story tests are described in
[frontend-testing.md](../docs/frontend-testing.md).
