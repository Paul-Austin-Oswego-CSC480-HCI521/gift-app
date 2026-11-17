# Candidate e2e tests

The list of Playwright tests still to write, and a step-by-step guide to recording them. You do not
need to know how to code: you click through the app, Playwright writes the steps down, and you copy
them into a file. For how the test setup works under the hood, see [README.md](README.md).

## Record your first test

### One-time setup (in a GitHub Codespace)

Recording opens a real browser window. The Codespace includes a small virtual desktop for it, which
you view in a browser tab. Create a **new** Codespace after this change reaches your branch, because
an existing one does not pick up the new setup. If yours predates it, use **Rebuild Container** from
the command palette (Ctrl+Shift+P or Cmd+Shift+P).

1. Open the repo on GitHub, choose the branch with the tests, and create a Codespace (**Code** >
   **Codespaces** > **+**). The wiki's [Playwright for QA](https://github.com/Paul-Austin-Oswego-CSC480-HCI521/gift-app/wiki/Playwright-for-QA)
   page has screenshots. Setup installs everything, including the Chromium browser, and takes a few
   minutes.
2. Open a terminal (**Terminal > New Terminal**) and check the setup by running the existing tests:
   ```bash
   cd frontend
   npm run test:e2e
   ```
   You should see `8 passed`.
3. Open the virtual desktop: in the **Ports** tab at the bottom, find port **6080** ("Desktop
   (noVNC)") and click its globe icon. In the page that opens, click **Connect** and enter the
   password `vscode`. Keep this tab open. When you record, the browser and the Playwright Inspector
   appear inside it.

You can also work on your own computer: install [Node.js](https://nodejs.org/) 22, clone the repo,
then in `frontend` run `npm install` and `npx playwright install chromium`. Recording opens normal
windows, with no virtual desktop.

### Record

1. Pick a test from the lists below. Each one names a **scenario** to record with.
2. In the terminal, in the `frontend` folder, type the scenario name after `npm run record --`:
   ```bash
   npm run record -- people-empty
   ```
   To see every scenario, run `npm run record -- --list`. To start on a different page of the same
   scenario, add `--url=/upcoming-dates` to the end.
3. A browser window and a second window called **Playwright Inspector** open (in a Codespace, they
   appear in the virtual desktop tab on port 6080). The browser shows the app as a signed-in user, with
   a fake server, so nothing you do changes real data.
4. In the Inspector, click the red **Record** button. Now click, type and navigate in the browser.
   Each action shows up as a line of code in the Inspector.
5. To check something, use the tools in the Inspector's toolbar (next to Record) and then click the
   thing on the page:
   - **Assert visibility** (eye icon): this element must be on the page.
   - **Assert text** (ABC icon): this element must show this text.
   - **Assert value** (cursor-in-box icon): this field must contain this value.

   **Every test needs at least one check.** A test that only clicks never fails, so it proves nothing.
6. Click Record again to stop. Copy the lines from the Inspector's code panel, then close the browser.

The terminal prints the lines your test file should start with. For `people-empty` it looks like this:

```js
import { test, expect, signIn, mockApi } from "./fixtures/index.js";

test("describe what this test checks", async ({ page }) => {
  // calls lists every API request the page makes, in case a test needs to check one
  const { calls } = await mockApi(page, {"people":{"body":[]}});
  await signIn(page);
  await page.goto("/people");
  // paste the recorded steps here
});
```

### Save it as a test

1. In VS Code, create a new file in `frontend/e2e/` named after the feature, ending in `.spec.js`
   (for example `people-empty.spec.js`).
2. Paste the block the terminal printed. Change the text in `test("...")` to say what the test
   checks, in plain words: `shows a message when there are no people`.
3. Replace the `// paste the recorded steps here` line with the lines you copied from the Inspector.
4. Save the file, then run only your test:
   ```bash
   npx playwright test people-empty --headed
   ```
   Green and `1 passed` means it works. Red means a step failed; the terminal says which line.
5. Run the whole suite once (`npm run test:e2e`) to make sure you did not break the others.
6. Open a pull request and ask Front-End to review it.

### If something goes wrong

- **A step fails with "not an input" or "element is not editable"** (usually a `.fill(...)` line):
  Carbon inputs wrap the real field. Add `.locator("input")` before `.fill`, like this:
  `await page.getByTestId("login-email-input").locator("input").fill("a@b.co");`
- **A recorded line uses a number like `.nth(2)`**: that breaks when the list changes. Re-record that
  step by clicking the item's name or button instead.
- **The test passes but proves nothing**: you forgot a check. Record again and use the assert tools.
- **`npm run record` says the app did not start**: run `npm run dev` in another terminal, wait for it
  to print a local address, then run `npm run record` again.
- **Anything else**: run `npx playwright test <name> --ui` to watch the test step by step and see
  where it stops, and ask in the QA channel with a screenshot.
- **Never type real passwords or personal data** into a recorded test. Recorded tests use a fake
  server and fake accounts.

### Two things to know about the fake data

- The dashboard (`/dashboard`) is a fixed snapshot. After you add a gift in the dashboard's modal,
  the dashboard rows do not change. Check the request instead (see rows 2 and 7).
- The dashboard's people (Alex Rivera, Sam Patel) are not the same people as the People page
  (Jaritza Lopez, Maureen Hart, River Stone, Tulsi Rao, Veronica Diaz).

## Tests to write

Every test in the tables on this page is a mocked `e2e/` test that runs in CI. Tests that need the
real server go in a separate folder that is run by hand at 8pm EST and never in CI; see
[Which folder does my test go in?](README.md#which-folder-does-my-test-go-in) and the
[live section](#priority-1-real-backend-smoke-run-svt) below.

**Level:** Easy is one page and one or two checks. Medium has a form or several steps. Names in the
**Record with** column are scenarios from `npm run record -- --list`.

### Quick win

| # | Test: what to do, then what to check | Record with | Level |
|---|---|---|---|
| 1 | **Real-backend smoke run** (login, add a gift, see it on the dashboard). Not recorded with `npm run record` and not in `e2e/`. See [Priority 1](#priority-1-real-backend-smoke-run-svt) below. | n/a | Needs a developer |
| 2 | Click **Log in** with both fields empty. Check the login form is still showing, and that no login request was sent (this closes a gap in issue #62). | `login` | Easy. Add the line below. |

To check that no login request was sent, add this line after your recorded steps:

```js
expect(calls.some((call) => call.path.endsWith("/auth/login"))).toBe(false);
```

### User flows

| # | Test: what to do, then what to check | Record with | Level |
|---|---|---|---|
| 3 | **Create account.** Fill in first name, last name, email, password and confirm password, then submit. Check you land on the login page. Also record: submitting empty (check the inline errors show), and the email-already-exists case (check the error banner shows "An account with those details already exists."). | `create-account`, `signup-conflict` | Medium |
| 4 | **Login and create-account links.** On the login page click the create account link and check that page shows. Click its Log in link and check you are back. | `login` | Easy |
| 5 | **Wish list.** Add an item with a name and price, save, and check the new row shows. Also record: edit an item and check the change shows; a wish list with nothing on it (check the empty message); the server failing (check the error banner); a failed save (check the error in the editor); a search for `Azul` (check only that row is left); the second page of the table (9 items, 7 per page). | `wishlist`, `wishlist-empty`, `wishlist-error`, `wishlist-save-error` | Medium |
| 6 | **Preferences.** Change a field, click **Save Preferences**, and check the success banner. Check the right request was sent (see below). Also record: first-time user, and the first save conflicting, where the page retries and still succeeds; loading failing (check the error banner and the Retry button); the quick preferences form (check its sections show). | `preferences`, `preferences-first-time`, `preferences-conflict`, `preferences-error`, `quick-preferences` | Medium |
| 7 | **Add a gift.** On the dashboard click Add on Gifts to Buy, fill in the name, choose a person, submit, and check the modal closes. Check the request was sent (see below). Also record: submit with the name empty (check the errors), close with the X, and a failed save (check the error banner). | `dashboard`, `add-gift-error` | Medium |
| 8 | **Add a person.** Click Add person, fill in a first and last name, save, and check the new tile shows. Also record cancel, and a failed save. | `people`, `people-add-error` | Medium |
| 9 | **Person profile.** From People, click the first person. Check their name and their gifts (Noise-cancelling headphones, Hiking boots) show. Also record: a person that does not exist (check the error and the back link), and a bad id (check "No valid person was selected"). | `people`, `profile-missing`, `profile-invalid` | Medium |
| 10 | **Upcoming dates.** Check the three occasions show, soonest first (Jaritza's birthday, Maureen's anniversary, Jaritza's holiday). Also record: nothing upcoming (check the message), the server failing (check the error banner), and a search. | `upcoming-dates`, `upcoming-dates-empty`, `upcoming-dates-error` | Easy |
| 11 | **View All links.** On the dashboard click View all on People, check the People page, go back, and do the same for Upcoming Dates. | `dashboard` | Easy |
| 12 | **People page states.** Check the message when nobody is added; search for `zzz` and check no tiles are left; check the error banner when the server fails. | `people-empty`, `people`, `people-error` | Easy |

To check the request for rows 6 and 7, add a line after your recorded steps. For a gift:

```js
expect(calls.some((call) => call.method === "POST" && call.path.endsWith("/gift/person/1"))).toBe(true);
```

For saving preferences, use `call.method === "PUT"` (or `"POST"` for a first-time user) and
`call.path.endsWith("/preferences")`.

The dashboard's Gifts to Buy **View all** link points at `/all-gifts`, a placeholder page that is not
being built. Decide with Front-End what that link should do before writing a test for it.

### Sign-in and error handling

| # | Test: what to do, then what to check | Record with | Level |
|---|---|---|---|
| 13 | **Expired sign-in.** Just open the page and check you land on the login page. Do one test per page. | `session-expired`, `people-expired`, `upcoming-dates-expired`, `preferences-expired` | Easy |
| 14 | **Signed out.** Open a signed-in page without signing in and check you land on the login page. Do one per page by adding `--url=` (for example `--url=/people`, `/my-wishlist`, `/upcoming-dates`, `/full-preferences`, `/gift-people-profile`). | `signed-out` | Easy |
| 15 | **Server errors.** Open the page and check the error banner shows (dashboard, people, upcoming dates, wish list). | `dashboard-error`, `people-error`, `upcoming-dates-error`, `wishlist-error` | Easy |
| 16 | **Loading.** The page waits 3 seconds. Check the loading message shows first, then the people appear. | `people-slow` | Medium |
| 17 | **Cold-start message** (issue #172, still open). The first call takes over 2.5 seconds and "Waking up our servers..." shows, then goes away when data arrives. Blocked until the feature ships. | `people-slow` | Blocked |
| 18 | **Log out.** On the dashboard click the log out button and check you are on the login page. | `dashboard` | Easy |

### Navigation

| # | Test: what to do, then what to check | Record with | Level |
|---|---|---|---|
| 19 | **Side nav.** Click each item in the side nav and check the right page opens. `routes.js` still lists All Gifts and Settings, which open empty placeholder pages. Decide whether to remove them before testing them. Also check what Add Gift and Add Recipient do (they have no pages and may show a 404). | `dashboard` | Medium |
| 20 | **404 page.** Check the not-found page shows, click the link home, and check you land on the login page. The scenario opens `/404` directly: the local dev server cannot show this page for a made-up address (it returns an empty 404), only the deployed site can. | `not-found` | Easy |
| 21 | **Dashboard cards.** Click Add and View all on each card and check where each one goes. | `dashboard` | Medium |

### Needs a developer

These loop over pages or switch the fake server partway through, which recording cannot do. Ask a
Front-End teammate to pair on them.

| # | Test |
|---|---|
| 22 | **Link check.** Every internal link on each page opens without a 404, and external links have a valid address (do not follow them). |
| 23 | **Error recovery.** After a failed load, reloading shows the page again (the first response fails, then a normal one). |

### Blocked until the feature exists

| # | Test | Why |
|---|---|---|
| 24 | **Add a date** (#226) | Issue #239: the dates page has no way to add or edit a date. |
| 25 | **Gift tracking**: status, history, receipts, returns and cost (#91) | The fake data has a `purchased` status only. No receipt or return tracking exists in the frontend. Confirm what exists, and report the rest as blocked, not passed. |

## Priority 1: real-backend smoke run (SVT)

This is the one test that talks to the real server, so it is **not** recorded with `npm run record`
and does **not** go in `e2e/`.

1. **Real-backend smoke run**: login, add a gift, see it on the dashboard, against the live
   Liberty backend and Neon database instead of the mocked API. This is the SVT-style end-to-end
   check (frontend through JAX-RS to the database and back).
   - **Not run in CI.** QA runs it by hand at **8pm EST**, when the server is automatically
     active. The Render instance sleeps otherwise, and the first request can take about a minute.
   - **Keep it out of the CI suite.** `npm run test:e2e` runs every `e2e/**/*.spec.js` with the
     mocked API, so this spec goes in `e2e-live/` with its own Playwright config and its own
     `npm` script (`npm run test:e2e:live`) that no workflow calls. The folder is set up (see
     [`../e2e-live/README.md`](../e2e-live/README.md)); `npm run lint:live-isolation` runs in the CI
     `e2e` job and fails if CI could reach it.
   - **To record it:** at 8pm, first open
     `https://gift-app-rppl.onrender.com/gift-app/api/ping` and wait for `{"status":"OK"}`. Then run
     `npx playwright codegen https://gift-app-project.netlify.app/` and use the shared test account
     (never type the password into a file; a developer swaps it for an environment variable).
   - **Target:** the production Netlify site or a local frontend with a reachable backend. Backend
     CORS allows only the production origin, so Netlify Deploy Previews cannot call the API.
   - **Needs:** the shared synthetic test account and reset procedure from issue #73. Credentials
     come from environment variables and must never be committed. Record the URL, commit SHA,
     date and time, and result with each run.
   - If the account, data or backend is unavailable, report the run as blocked, not passed.

   Further live candidates from the plan's data integrity scope. All need the real server, so they
   go in the same live folder:
   - **Full CRUD round trip**: create a wishlist item or person, read it back after a reload, edit
     it, delete it, and confirm it is gone. Clean up afterwards so the shared test account stays
     reusable.
   - **Unauthorized access blocked**: the test account's token cannot read or change another user's
     data (for example `GET /user/<other id>`), and a request with no or an invalid token gets a
     401.
   - **Data persists across sessions**: log out, log back in, and the data from the earlier run is
     still there.
   - **Per-user dashboards** (#229): two different test accounts each see only their own people,
     gifts and dates.
   - **View-all lists match saved records** (#228): after adding at least two people and dates, the
     full lists show all of them.
   - **Sign-up with a real account** (#217, #218): needs a unique email each run and creates a
     permanent account, so decide with Backend how test accounts are cleaned up first. The manual
     cases are currently marked blocked ("account creation unavailable").

## Rule: tests that need the real server live in their own folder

Any test that needs real data from the server (the Render backend and Neon database) goes in a
separate folder, not in `e2e/`. The backend is only reliably awake at 8pm EST, and Render sleeps
when idle, so a live test can fail only because the server was asleep. That is a false positive, and
it would block PRs if CI ran it. Keeping live tests apart means we choose when they run.

Quick check: if the test needs a saved record to survive a reload or a new login, needs the real
login or token check, or could fail just because the server was asleep, it is a live test. Anything
else is an `e2e/` test. The full checklist, with examples, is in
[README.md](README.md#which-folder-does-my-test-go-in).

| | `e2e/` (mocked API) | `e2e-live/` (real server, proposed name) |
|---|---|---|
| Needs the server awake | No | Yes |
| Runs in CI | Yes, on every PR | **Never** |
| Who runs it | Anyone, any time | QA, at 8pm EST when the server is active |
| Failure means | A real regression | A regression, or the environment (check the server first) |

Everything in the "Tests to write" tables is a mocked `e2e/` test. A new candidate that needs real
data belongs in the live folder, not `e2e/`.

## Current coverage (8 tests)

| File | Tests |
|---|---|
| `login.spec.js` | Valid login lands on `/dashboard`. A 401 shows the "Incorrect email or password." banner. Empty submit flags both fields `invalid`. |
| `dashboard.spec.js` | Signed in, the people rows, the total and the gifts row render. A signed-out visit redirects to `/`. The add-gift button opens the modal. |
| `people.spec.js` | The mocked people are listed. Search filters the tiles. |

The mocked API covers every endpoint the frontend calls, so no row above is blocked on mock data.
These pages have no tests yet: `create-account`, `my-wishlist`, `upcoming-dates`, `full-preferences`,
`quick-preferences` and `gift-people-profile`. No test covers the side nav, error or loading states, or
any write (POST or PUT). `all-gifts` and `settings` are placeholder pages and are not being built, so
they are not candidates.

## Scope, from the QA Testing Approach Plan

**In scope (relevant to these tests):** SVT and full end-to-end user workflows (Playwright), data
integrity (create, update, retrieve and delete work, and unauthorized changes are blocked), navigation
(internal and external links, broken links, redirects, error recovery), login and sign-up, profile
(wishlist, size and preferences), task tracking (gifting status, history, receipts and returns,
cost), build verification and smoke testing (Playwright), and load and stress testing (JMeter, not
Playwright). Browser: Chrome only.

**Out of scope:** usability testing, unit testing and TDD, function testing, mobile app and iOS,
mobile layouts, accessibility scans (issue #94 was closed as out of scope for QA), and every
browser except Chrome (no Safari, WebKit or Firefox). Visual snapshots
(`toHaveScreenshot`) are also out of scope for Playwright for now; Front-End's Happo covers visual
regression. A dark theme smoke test belongs to Front-End, not QA. The `all-gifts` and `settings`
pages are not being built.

## Tags for smoke and regression runs

Tag a short set of tests `@smoke` (login, page loads, side nav, create-account navigation) so QA can
run only those first on a new build. This matches the manual cases in issues #78, #131, #132 and
#134. Add `@regression` as well (issue #93), and consider each fixed defect for a new regression test.
A tag is just text at the end of the test name:

```js
test("logs in and lands on the dashboard @smoke", async ({ page }) => { /* ... */ });
```

Run a tag with `npx playwright test --grep @smoke`.

## How this maps to the QA issues

Checked against the open and closed `quality-assurance` issues in the repo (the project board's
status and sprint fields were not visible, only the issues).

| Issue | What it asks for | Where it lands in this list |
|---|---|---|
| #62 login smoke tests | Success, empty-field validation, 401 banner | Done in `login.spec.js`. Gap: row 2. |
| #86 extend smoke suite | Core pages load, key elements render, navigation works, protected page loads after login | The `@smoke` tag above, with rows 4, 10, 19 and 20. Its "log in with a shared test account" and "run against a deploy preview or main" criteria need the real server, so they belong in the live folder. |
| #87 login and sign-up | Valid, wrong password, unknown user, empty fields, sign-up, duplicate, logout, session after refresh | Rows 3, 4, 13, 14 and 18 mocked. Session-after-refresh with a real token is live. |
| #88 navigation and links | Routes via nav, internal and external links, redirects, unknown URL | Rows 14, 19, 20, 21, 22. |
| #89 gift list | Add, edit, remove, persists after refresh and re-login, cleans up its data | Rows 5 and 7 mocked. Persistence and cleanup are live (item 1). |
| #90 profile | Wishlist, size and preference fields, persistence, invalid input | Rows 5, 6 and 9 mocked. Persistence is live. |
| #91 gift tracking | Status, history, receipts, returns, cost totals | Row 25, blocked. |
| #84 data integrity | CRUD matrix, unauthorized access, invalid input, via the UI | Live folder (item 1, further candidates). |
| #93 regression suite | Tag tests (smoke, regression) so a run can select them | The tags section. |
| #92 CI job | Playwright on PRs against the Netlify deploy preview | Mocked `e2e/` tests only, run against the local dev server. Previews cannot reach the API (CORS). |
| #225-#229 DB verification cases | Add person, add date, add gift, view-all lists, per-user dashboards | Rows 7, 8, 11 and 24, plus live candidates in item 1. |
| #172 cold-start message | "Waking up our servers..." after 2.5 seconds | Row 17. The issue is still open. |

## Suggested starting point

Item 1 first, since it is the only SVT-style check (it needs a developer to set up the live folder).
For a first recorded test, take row 2, 12 or 20, then rows 14, 13 and 19. They give the most coverage
for the least effort, and the sign-in redirect is repeated logic across pages.

## For reviewers: what each scenario sets up

Not needed to record a test. A developer reviewing a recorded test can use this. The mock keys are the
ones in the README's "Mocking the API" table.

| Scenario | Starts on | Mock overrides |
|---|---|---|
| `login`, `create-account`, `not-found`, `signed-out` | `/`, `/create-account`, `/404`, `/dashboard` (signed out) | none |
| `login-fail` | `/` | `login` 401 |
| `signup-conflict` | `/create-account` | `signup` 409 |
| `dashboard` | `/dashboard` | none |
| `dashboard-error`, `session-expired` | `/dashboard` | `user` 500, `user` 401 |
| `add-gift-error` | `/dashboard` | `addGift` 500 |
| `people`, `people-empty`, `people-error`, `people-slow` | `/people` | none, `people` empty, `people` 500, `people` delay 3 s |
| `people-expired`, `upcoming-dates-expired`, `preferences-expired` | their pages | `people` or `preferences` 401 |
| `people-add-error` | `/people` | `addPerson` 500 |
| `profile`, `profile-missing`, `profile-invalid` | `/gift-people-profile?personId=1`, `99`, `abc` | none, `person` 404, none |
| `upcoming-dates`, `-empty`, `-error` | `/upcoming-dates` | none, `people` empty, `people` 500 |
| `wishlist`, `-empty`, `-error`, `-save-error` | `/my-wishlist` | none, `wishlist` empty, `wishlist` 500, `saveWishlistItem` 500 |
| `preferences`, `-first-time`, `-conflict`, `-error` | `/full-preferences` | none, `preferences` 404, `preferences` 404 and `createPreferences` 409, `preferences` 500 |
| `quick-preferences` | `/quick-preferences` | none |

Useful test ids, if a recorded step needs adjusting: `login-form`, `login-submit-button`,
`create-account-form`, `people-tile-<id>`, `people-empty-message`, `people-error-banner`,
`wishlist-row-<id>`, `wishlist-empty-message`, `wishlist-error-banner`, `upcoming-dates-table`,
`dates-row-<id>`, `full-preferences-success-banner`, `full-preferences-error-banner`,
`dashboard-gifts-add-button`, `gift-modal-submit-button`, `gift-modal-error-banner`,
`nav-header-logout-button`, `not-found-page`, `side-nav`. The full naming rules are in
`docs/carbon-conventions.md#test-hooks-data-testid`.
