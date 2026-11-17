# Test ideas for Front-End and Back-End

Not for QA. Under [ADR-Testing-Ownership](https://github.com/Paul-Austin-Oswego-CSC480-HCI521/gift-app/wiki/ADR-Testing-Ownership),
QA owns user workflows, regression runs, load testing and SVT. These ideas sit in the other teams'
layers. They are optional, and each one is recordable with `npm run record -- <scenario>` (see
`npm run record -- --list`) unless noted. The scenario names are the ones the record command lists.

## Front-End (page scripts and routing)

Checked against the Storybook `play` stories and the Vitest tests. Components are already covered
there: empty, loading and error states, search, pagination, modal open and close, form validation,
the side nav links, and the preferences save and conflict logic. So these ideas are only what a
component test cannot see: the page scripts in `src/pages/` that fetch, map a status code to a
message, and redirect, plus real routing. They use the fake server.

| Idea | Why it is not covered already | Scenario |
|---|---|---|
| A 500 from the server shows the error banner on People, Upcoming Dates, Dashboard and Wish List | Stories pass `error` to the component by hand. Nothing checks that each page script turns a failed fetch into that error. | `people-error`, `upcoming-dates-error`, `dashboard-error`, `wishlist-error` |
| A 401 redirects to the login page on every page | Page scripts call `clearAccessToken()` and redirect. No unit test or story runs that. (QA's guide covers sign-in redirects as user flows, so only add this if you want a per-page check.) | `session-expired`, `people-expired`, `upcoming-dates-expired`, `preferences-expired` |
| Create account: a 409 shows "An account with those details already exists." | `create-account.js` maps the status to this text. The form stories only pass `errorMessage` in. | `signup-conflict` |
| Person profile: a missing person shows the error and back link, a bad id shows "No valid person was selected" | The component test passes an error in. The page script decides which message. | `profile-missing`, `profile-invalid` |
| Wish list: a failed save shows the error in the editor | The table story and test cover validation only, not a rejected request. | `wishlist-save-error` |
| Add gift and add person: a failed save shows the error banner | Stories check the emitted event, not what happens when the request fails. | `add-gift-error`, `people-add-error` |
| 404 page shows, and its link goes home | No story or test for the not-found page. | `not-found` |
| Cold-start message "Waking up our servers..." (#172, blocked until it ships) | Not built yet. | `people-slow` |
| Link check: every internal link opens without a 404, external links have a valid address | Needs a loop over pages, so it needs a developer to write it. | none |
| Error recovery: after a failed load, a reload works | Needs a fixture that fails only the first response. | none |

## Back-End (API and database)

What exists in `src/test/java/` (read from the code, not run):

- **Resource tests** (`resource_tests/`): unit tests. They build a resource class directly and swap in
  a Mockito mock of the repository, so there is no HTTP, no Liberty, no database, and filters such as
  `OwnershipFilter` never run. They check the resource logic: create, read, update and delete, with
  the 200/201/204 and 400/404 cases.
- **`AuthEndpointIT`**: the only test that talks to a real server. It is opt-in (the `auth-contract`
  Maven profile plus `AUTH_TEST_*` environment variables) and only covers auth: login, the token
  against the trusted JWKS, and 401s for no token, a tampered token and bad credentials.

So nothing tests the real HTTP layer or a real data round trip. Ideas, best first. Each can be a
Failsafe integration test in Maven (like `AuthEndpointIT`) or a Playwright `request` test (HTTP only,
no browser) in `e2e-live/`:

1. **Ownership.** `OwnershipFilter` returns 403 when the `/user/<id>` in the path is not the token's
   subject. A user's token asking for another user's data should get 403, and no token should get 401
   on every protected route, not just one. No test references the filter today.
2. **Create, read, update, delete round trip over HTTP.** Create a person and a gift, read them back,
   update, delete, and confirm a 404 afterwards. Clean up so the shared test account stays reusable
   (#73).
3. **Response shape.** Assert the JSON field names the frontend relies on (for example a person's
   `firstName`, a gift's `status`). This is the contract that keeps the frontend's mock data honest
   (see below).
4. **Duplicate sign-up returns 409.** The frontend shows "An account with those details already
   exists." for it, but no test checks the API sends it. Needs a unique email per run, so agree how
   test accounts are cleaned up first.
5. **Invalid input.** Missing required fields or a malformed id gets a 400 or 404, never a 500.

## Why QA's tests use a fake server

The mocked tests in `e2e/` do not call Render at all, so they do not depend on whether the server is
awake and they run in seconds in CI. That is the right trade for workflow tests. The cost is that the
mock can drift from the real API: the frontend tests keep passing after the backend changes a field
name. Two things guard against it, and both are worth keeping:

- the response-shape tests in idea 3, run by Back-End, so a backend change fails there first;
- the live smoke run in `e2e-live/`, which QA runs by hand when the server is awake.
