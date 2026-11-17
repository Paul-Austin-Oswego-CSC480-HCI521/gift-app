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

Playwright is not the right tool here. API tests already live in Maven (`./mvnw test`, plus the
Failsafe integration tests), and a second API suite in Playwright would duplicate them. What exists
in `src/test/java/`:

- **Resource tests** (`resource_tests/`): create, read, update and delete for gifts, people, and user
  and person attributes, with the 200/201/204 and 400/404 cases.
- **Auth resource tests**: login with an unknown email, wrong password and missing stored hash all
  return 401.
- **`AuthEndpointIT`**: no token and a tampered token get a 401 on a protected endpoint, and bad
  credentials get identical 401 responses.

Gaps I found by searching the tests, which are Maven ideas, not Playwright ones:

- **Ownership:** `OwnershipFilter` returns 403 when the `/user/<id>` in the path is not the token's
  subject. No test references it. A user's token asking for another user's data is worth an
  integration test.
- **Duplicate sign-up:** the frontend maps a 409 to "An account with those details already exists."
  but no test I found checks that the API returns 409.

QA's live checks (guide and `e2e-live/`) only reach the API through the UI, which is the SVT scope.
