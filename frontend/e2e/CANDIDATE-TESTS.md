# Candidate e2e tests

Ideas for Playwright tests that are not written yet. For how the current tests work, see
[README.md](README.md).

## Current coverage (8 tests)

| File | Tests |
|---|---|
| `login.spec.js` | Valid login lands on `/dashboard`. A 401 shows the "Incorrect email or password." banner. Empty submit flags both fields `invalid`. |
| `dashboard.spec.js` | Signed in, the people rows, the total and the gifts row render. A signed-out visit redirects to `/`. The add-gift button opens the modal. |
| `people.spec.js` | The mocked people are listed. Search filters the tiles. |

Only three API routes are mocked: `POST /auth/login`, `GET /user/:id/person` and `GET /user/:id`.
These pages have no tests: `create-account`, `my-wishlist`, `all-gifts`, `upcoming-dates`,
`full-preferences`, `quick-preferences`, `gift-people-profile` and `settings`. No test covers the
side nav, error or loading states, or any write (POST, PUT, DELETE). There is one browser and one
viewport.

## High value (whole untested flows)

1. **Create account**: a valid signup calls `/auth/signup` and goes to the next page. Also cover
   validation errors and a failed signup (for example a 409 duplicate email). Needs a new
   `/auth/signup` mock.
2. **Login and create-account links**: the login page links to create-account, and back.
3. **Wishlist (`my-wishlist`)**: the list renders. Adding an item sends a POST and the row appears.
   Editing sends a PUT to `/:id`. An empty state shows. Needs wishlist mocks.
4. **Preferences**: `full-preferences` loads existing values, saving does a POST, and a 409 falls
   back to PUT (the logic in `src/api/preferences.js`). Also cover the first-time case where the
   load fails and the form is empty.
5. **Add-gift modal end to end**: fill in and submit, then see the new row. Also cover cancel, close
   and validation. The current test only checks that the modal opens.

## Auth and error handling

6. **401 mid-session**: a 401 from `/user/:id` or `/person` clears the token and redirects to `/`.
   `people.js`, `dashboard.js` and others implement this and it is untested.
7. **Signed-out redirect on every authed page**: a parameterized test over the routes in
   `src/config/routes.js`. Only the dashboard is tested now.
8. **Non-401 failures**: a 500 shows `cds-inline-notification kind="error"` on dashboard, people,
   upcoming-dates and wishlist.
9. **Loading state**: delay a route and assert the `role="status"` inline loading appears and then
   disappears.
10. **Logout**: sign-out clears `sessionStorage`, if the UI offers it in settings or the nav.

## Navigation and shared shell

11. **Side nav**: each item in `routes.js` navigates to the right page and marks the active item.
    Include the `add-gift` and `add-recipient` targets, which have no pages yet. Check what they do,
    because they may 404.
12. **404 page** for an unknown route.
13. **Dashboard cards link through** to people, upcoming dates and all gifts.

## Page-specific

14. **People**: the empty state (`kind="info"`) when the list is empty, and the no-results state for
    a search with no match. The search updates the URL query (`history.replaceState`), so test that
    a deep link `/people?q=...` pre-fills the search. Pagination via `cds-pagination` (page size and
    page change) is also untested.
15. **Add a person**: the `/person` POST in `people.js`, then check the tile appears.
16. **Person profile**: clicking a tile opens `gift-people-profile` with the right person. Cover the
    edit flow and the load failure. The page reads a query param, so also test a missing or invalid
    id.
17. **Upcoming dates**: the table renders sorted by date from the mocked people, with its empty state.
18. **All gifts**: the table renders, with sort and filter if they exist.
19. **Settings**: whatever is there (theme toggle if the dark theme is switchable, persisted across
    reload).

## Cross-cutting

20. **Keyboard and accessibility**: tab order and Enter-to-submit on login. The modal traps and
    restores focus, and Escape closes it. Optionally an `@axe-core/playwright` scan per page.
21. **Responsive layout**: add a mobile project (for example Pixel 7) and check that the side nav
    collapses to the hamburger.
22. **Dark theme** smoke test, with `brand-theme-dark.css` applied.
23. **Additional browsers**: add Firefox and WebKit projects, since Carbon web components and
    shadow-DOM locators can behave differently.
24. **Visual snapshots** (`toHaveScreenshot`) for the main pages. These are brittle, so consider
    doing this last.
25. **Real-backend smoke run** against Liberty and a seeded DB: login, add a gift, see it on the
    dashboard. The README lists this as a possible later step.

## Suggested starting point

Items 1, 3, 6, 7 and 11. They give the most coverage for the least mocking work, and the 401
redirect is repeated logic across pages.
