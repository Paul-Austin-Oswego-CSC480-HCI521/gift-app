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
npm run test:e2e:all              # mocked tests, then the live tests (by hand, at 8pm EST; never in CI)
npx playwright codegen http://localhost:5173   # record clicks and get locator suggestions
npx playwright show-report        # open the HTML report from the last run
```

If a test fails in CI, download the `playwright-report` artifact from the run and open
`index.html`. Failed-then-retried tests include a trace you can step through.

## Which folder does my test go in?

There are two kinds of Playwright test. Pick the folder **before** you record.

| | `e2e/` (this folder) | `e2e-live/` (separate folder, run on command) |
|---|---|---|
| API | Mocked by `mockApi` (`fixtures/api.js`) | The real Render backend and Neon database |
| Depends on the time of day | No | **Yes.** The backend is only reliably awake at **8pm EST**; Render sleeps otherwise and the first request can take about a minute |
| Runs in CI | **Yes**, on every PR (`npm run test:e2e`) | **Never.** No workflow may call it |
| Who runs it | Anyone, any time | QA, by hand, at 8pm EST |
| Recorded with | `npm run record -- <scenario>` | `npx playwright codegen <live site>` after waking the server |
| If it fails | A real regression: fix it before merging | A regression **or** the environment. Check the server first, and report "blocked", not "failed", if it was asleep |

**Ask three questions.** If the answer to any is yes, the test goes in `e2e-live/`:

1. Does it need data that actually lives in the database (a saved record that survives a reload,
   log out and log back in, or another user's data)?
2. Does it need the real server to answer (a real login, a real 401 from the real token check, CORS,
   the database writing the row)?
3. Could it fail only because the server was asleep or slow to wake?

If all three are no, it is an `e2e/` test. This covers almost everything: what a page shows for a
given response, form validation, error banners, loading and empty states, navigation, redirects, and
which request the page sent (check `calls`). Use the overrides (`{ people: { status: 500 } }`,
`{ people: { delay: 3000 } }`) to create the situation instead of waiting for the real server to
produce it.

Examples:

| Test | Folder | Why |
|---|---|---|
| Wrong password shows the error banner | `e2e/` | The mock returns 401. |
| Adding a person sends a `POST` and the tile appears | `e2e/` | The mock keeps the new person in memory for that test. |
| The people page shows an error banner when the server fails | `e2e/` | `{ people: { status: 500 } }`. |
| Log in with the shared test account and reach the dashboard | `e2e-live/` | Needs the real login. |
| Add a gift, reload, and it is still there | `e2e-live/` | Needs the database to store it. |
| One user cannot read another user's data | `e2e-live/` | Needs the real authorization check. |

**Rules for keeping them apart:**

- A test in `e2e/` must never call the real backend. Every API call goes through `mockApi`. If a
  test needs `page.route` to be skipped, it belongs in `e2e-live/`.
- `playwright.config.js` points `testDir` at `./e2e`, so `e2e-live/` is never picked up by
  `npm run test:e2e` or the CI `e2e` job. Live tests get their own config and their own script
  (for example `test:e2e:live`), and no workflow calls that script. Do not change `testDir` to `.`
  or add a glob that reaches `e2e-live/`.
- Live tests read the test account's email and password from environment variables. Never write
  credentials into a spec or commit them.
- `e2e-live/` exists, with its own config (`playwright.live.config.js`) and scripts
  (`npm run test:e2e:live`, `npm run record:live`). See [`../e2e-live/README.md`](../e2e-live/README.md).
  CI enforces the separation: the `e2e` job runs `npm run lint:live-isolation` before the tests, and
  it fails if any workflow mentions the live tests or the main config stops pointing at `./e2e`.

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

Not sure what to test, or new to coding? [CANDIDATE-TESTS.md](CANDIDATE-TESTS.md) lists what to write next and explains how to record a test by clicking through the app (`npm run record -- <scenario>`), no coding needed.

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

`mockApi(page)` already runs for every test. It mocks every endpoint the frontend calls: login, signup,
the user, the people list, one person, add person, add gift, the wishlist and preferences. Responses reuse
the Storybook data in `src/mocks/` (`dashboard-user.js`, `people.js`, `person-gifts.js`, `wishlist.js`,
`preferences.js`). Writes (POST, PUT) change an in-memory copy for that test, so after adding a person the
list reloads with them. Nothing is saved anywhere else.

To change a response for one test, pass `{ status, body, delay }` for an endpoint. Leave out any part to
keep its default. Call it **before** `page.goto()`:

```js
import { test, expect, mockApi } from "./fixtures/index.js";

test("shows the error banner when login fails", async ({ page }) => {
  await mockApi(page, { login: { status: 401, body: {} } });
  // ...
});
```

| Key | Endpoint |
|---|---|
| `login`, `signup` | `POST /auth/login`, `POST /auth/signup` |
| `user` | `GET /user/:id` (the dashboard) |
| `people`, `addPerson` | `GET` and `POST /user/:id/person` |
| `person` | `GET /user/:id/person/:pid` (the profile) |
| `addGift` | `POST /user/:id/gift/person/:pid` |
| `wishlist`, `saveWishlistItem` | `GET /user/:id/wished_items`, and `POST` or `PUT` to save |
| `preferences` | `GET /user/:id/preferences` |
| `createPreferences`, `savePreferences` | `POST` (the first save) and `PUT` (later saves) on `/user/:id/preferences` |

Common overrides: `{ people: { body: [] } }` for an empty list, `{ user: { status: 500 } }` for a failed
load, `{ people: { status: 401 } }` for an expired session, `{ preferences: { status: 404 } }` for a user
with no preferences yet, `{ createPreferences: { status: 409 } }` for the create conflict (the page then retries as a PUT), and
`{ people: { delay: 3000 } }` for a slow server (loading and cold-start states).

`mockApi` returns `{ calls }`, a list of every API request the page made (`{ method, path, body }`). Use it
to assert that a request was sent, or was not:

```js
const { calls } = await mockApi(page);
await page.goto("/");
await page.getByTestId("login-submit-button").click();
expect(calls.filter((call) => call.path.endsWith("/auth/login"))).toHaveLength(0);
```

The fake token is JWT-shaped because the wishlist API reads the user id from its `sub` claim. To mock
another endpoint, add a route in `fixtures/api.js` and its data under `src/mocks/` so Storybook can use it.
Tests that need real persistence do not belong here; they go in the live folder.

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
