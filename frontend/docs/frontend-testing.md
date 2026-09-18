# Frontend testing (unit + component)

How to write and run the frontend's local unit/component tests. This covers what Full Stack owns:
logic in `src/api/` and behavior of the Web Components in `src/components/`. It does not cover
QA's end-to-end, smoke, or regression testing. Storybook's `npm run test:a11y` / whichever visual
regression tool the team adopts remain the accessibility/visual-regression layer; the Vitest "storybook" project below is a third,
narrower thing — it just confirms every story still renders — see [carbon-conventions.md](carbon-conventions.md)
and the wiki's [Frontend CI Proposal](../../../wiki/Frontend-CI-Proposal).

This setup runs as **two Vitest projects** (`vite.config.js` → `test.projects`):

- **`unit`** — plain logic and component tests in jsdom (no browser). This is where you'll write
  almost all new tests; see the walkthrough and recipe below.
- **`storybook`** — powered by [`@storybook/addon-vitest`](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon),
  runs every existing Storybook story as a smoke test in a real headless Chromium browser (via
  [Playwright](https://playwright.dev/)). You don't write these tests by hand — any component that
  already has a `.stories.js` file gets one automatically. This is the one place Playwright shows
  up in the frontend, and it's scoped to "does this story still render", not end-to-end app flows —
  that stays QA's territory.

## Before you start: prerequisites

Testing a Web Component assumes you already understand what a Web Component *is* (custom elements,
shadow DOM, slots). If you haven't done the [Front-End team onboarding](../../../wiki/Team-Front-End)
reading yet — especially the Web Components course — do that first. Trying to learn shadow DOM and
testing at the same time is harder than doing them one at a time.

## Tools

- [Vitest](https://vitest.dev/) — test runner, integrates directly with the existing Vite config.
- [jsdom](https://github.com/jsdom/jsdom) — DOM environment the `unit` tests run against (no browser needed).
- [@testing-library/dom](https://testing-library.com/docs/dom-testing-library/intro/) — queries
  elements the way a user would (by visible text, role, etc.) instead of relying on internal markup.
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) — adds readable DOM
  matchers (`toBeInTheDocument`, ...) to Vitest's `expect`.
- `@vitest/coverage-v8` — coverage reporting, no separate instrumentation step required.
- [@storybook/addon-vitest](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) +
  [@vitest/browser](https://vitest.dev/guide/browser/) + Playwright's Chromium — run the
  `storybook` project (see above). Installed as dev dependencies only; nothing here touches the
  production build.

## Running tests

```bash
cd frontend
npm test               # run once (CI-style) — both the unit and storybook projects
npm run test:unit       # just the unit/component tests (fastest — use this while developing)
npm run test:storybook  # just the Storybook story smoke tests
npm run test:watch     # re-run on change while developing (all projects)
npm run test:ui        # same as watch, but a browser UI you can click through instead of a terminal
npm run test:coverage  # run once with a coverage report (text + coverage/ HTML report)
```

New to automated testing? Start with `npm run test:ui` — it opens a browser page showing each test
file, each test, and (when something fails) a readable diff of what was expected vs. what happened.
It's a much easier way to see what's going on than reading a wall of terminal output. Day to day,
reach for `npm run test:unit` most often — it's the fast feedback loop for TDD; `test:storybook`
matters most after you add or change a story.

## Where tests live

Tests are co-located with the code they cover, as `*.test.js` next to the source file. API/logic
tests sit next to the module they test; component tests live inside that component's own folder,
alongside its Storybook story (see [frontend-structure.md](frontend-structure.md)):

```
src/api/client.js
src/api/client.test.js
src/components/gift-nav-header/gift-nav-header.js
src/components/gift-nav-header/gift-nav-header.test.js
src/components/gift-nav-header/gift-nav-header.stories.js
```

`test/setup.js` wires up `@testing-library/jest-dom`'s matchers for every test file (configured via
`test.setupFiles` in `vite.config.js`).

## New to testing? A first walkthrough (red → green → refactor)

TDD means writing the test for a behavior *before* the code that satisfies it, watching it fail (red),
writing the smallest code that makes it pass (green), then cleaning up (refactor). Concretely, for a
new component `src/components/gift-badge/gift-badge.js` with no code yet:

1. Create the folder `src/components/gift-badge/` and write
   `src/components/gift-badge/gift-badge.test.js` first, with one small test for the simplest
   behavior, e.g. "renders the text I pass it" (see the recipe below for the boilerplate).
2. Run `npm run test:watch` (or `test:ui`). The test fails — there's no `gift-badge.js` to import yet.
   That failure is expected and useful: it confirms the test actually exercises something.
3. Write just enough of `src/components/gift-badge/gift-badge.js` to make that one test pass. Don't
   add anything the test doesn't require yet.
4. Watch the test go green in the same terminal/UI (no need to re-run manually in watch mode).
5. Refactor if the code is messy, re-running to confirm it's still green.
6. Repeat for the next behavior (e.g. an empty/error/interaction case) — one small test at a time,
   not one giant test file written after the component is "done".

This is a different order than most people start with (write the component, then maybe test it
after) — the payoff is that you never end up with untested code, and the test tells you exactly
when you're finished (it's green) instead of guessing.

## Writing a test

**Plain logic (`src/api/client.js`)** — stub `global.fetch` and assert on the resolved value,
thrown error, or the request `fetch` was called with. Cover success, error, and empty-body cases,
and both branches of optional behavior (e.g. with/without an auth token).

**Web Components (`src/components/*.js`)** — this is the part that's genuinely new even for people
who've used Testing Library before: our components render into a **shadow DOM** (an isolated mini
-document each component owns), not directly into the page, so normal `document.querySelector` or
`screen.getByText` (which only look at the regular page) won't find anything inside a component.
You have to go through `element.shadowRoot` instead. Copy this pattern for a new component test:

```js
import { describe, expect, it } from "vitest";
import { within } from "@testing-library/dom";
import "./gift-badge.js"; // importing runs customElements.define(...)

async function renderGiftBadge(attrs = "") {
  const el = document.createElement("div");
  el.innerHTML = `<gift-badge ${attrs}></gift-badge>`;
  document.body.append(el);
  const badge = el.querySelector("gift-badge");
  await badge.updateComplete; // Lit renders asynchronously — always await this before asserting
  return badge;
}

describe("gift-badge", () => {
  it("renders the label text", async () => {
    const badge = await renderGiftBadge('label="Wrapped"');

    // within(badge.shadowRoot) — NOT document/screen — because the content lives in shadow DOM.
    expect(within(badge.shadowRoot).getByText("Wrapped")).toBeInTheDocument();
  });
});
```

Three things to always cover, following the existing tests as examples
([gift-nav-header.test.js](../src/components/gift-nav-header/gift-nav-header.test.js),
[gift-gradient-container.test.js](../src/components/gift-gradient-container/gift-gradient-container.test.js),
[gift-site-footer.test.js](../src/components/gift-site-footer/gift-site-footer.test.js)):

- default rendering (no attributes/slotted content — the "empty" case)
- attribute-driven rendering (e.g. `product-name="..."`)
- slotted content projection (`slot.assignedElements()` / `assignedNodes()`)

## Coverage

`npm run test:coverage` reports coverage for `src/**/*.js`, excluding `src/index.js` (wiring/entry
point, not logic) and `*.stories.js` files (Storybook fixtures, not app logic) — see
[frontend-structure.md](frontend-structure.md). Coverage is a signal, not a target to chase for its
own sake; prioritize tests for real success/error/empty/interaction behavior over hitting a
percentage.

## Scope: what this does *not* cover

Per the class's team split, Full Stack owns unit/function testing (this doc); QA owns end-to-end
system workflows, smoke testing, and regression testing (see the wiki's
[Team-QA](../../../wiki/Team-QA)). The `storybook` project's use of Playwright is scoped narrowly to
running our own stories in a browser (a frontend-owned, component-level concern) — it is not a
general license to add Playwright-based end-to-end app testing, load testing, or visual regression
tooling here; those stay with QA's own tooling and whichever visual regression tool the team
adopts, respectively (see the wiki's [Frontend CI Proposal](../../../wiki/Frontend-CI-Proposal)).
