# Live end-to-end tests

Tests that use the **real** backend (Render) and database (Neon). They are **not** part of CI and
**not** part of `npm run test:e2e`. Run them by hand, at **8pm EST** when the server is active.
Mocked tests (anything that does not need the real server) go in [`../e2e/`](../e2e/README.md#which-folder-does-my-test-go-in)
instead. Read that section first if you are not sure which folder a test belongs in.

## Before you run

1. Get the shared test account from a developer (issue #73). Set it in your terminal, never in a file:
   ```bash
   export LIVE_TEST_EMAIL="..."
   export LIVE_TEST_PASSWORD="..."
   ```
2. That is all. The run wakes the server for you: it pings the backend for up to two minutes first.
   If the server never answers, the run stops with **BLOCKED**. Report that as blocked, not as
   passed or failed, and try again at 8pm EST.

## Run

```bash
cd frontend
npm run test:e2e:live                 # run every live test against the production Netlify site
npm run test:e2e:all                  # the mocked tests first, then the live tests (stops if a mocked test fails)
npm run test:e2e:live -- --headed     # watch the browser (in a Codespace: the port 6080 desktop tab)
npm run record:live                   # record a new live test (opens the site and the Inspector)
npx playwright show-report playwright-report-live    # open the report from the last run
```

To point at a different frontend (for example one running locally with a reachable backend), set
`LIVE_BASE_URL`. Note that backend CORS only allows the production origin, so Netlify Deploy
Previews cannot call the API.

Write down the **site URL, commit SHA, date and time, and result** with every run.

## Writing a live test

- Record with `npm run record:live`, then paste the steps into a new `e2e-live/<feature>.spec.js`.
  Import `test` and `expect` from `@playwright/test` (not from `../e2e/fixtures`, which mocks the API).
- Get the account from `liveCredentials()` in `credentials.js`. Never type a real password into a
  recorded test; replace it with the variable.
- **Clean up after yourself.** Delete anything the test creates so the shared account stays reusable.
- Tests run one at a time and never retry, because a retry could repeat a write.

## What is here

| File | What it does |
|---|---|
| `smoke.spec.js` | Real login reaches the dashboard. The add-a-gift step is `fixme` until a developer adds cleanup. |
| `global-setup.js` | Wakes the backend before the run, and stops with BLOCKED if it does not wake. |
| `credentials.js` | Reads the test account from the environment. |
| `../playwright.live.config.js` | Separate config. The main `playwright.config.js` only looks in `e2e/`. |

Candidate live tests (CRUD round trip, unauthorized access, persistence, per-user dashboards) are
listed in [`../e2e/CANDIDATE-TESTS.md`](../e2e/CANDIDATE-TESTS.md#priority-1-real-backend-smoke-run-svt).
