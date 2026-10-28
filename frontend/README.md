# Frontend

The gift-tracker web frontend: [IBM Carbon Design System](https://carbondesignsystem.com/) via its Web Components implementation (`@carbon/web-components`), plain JavaScript, built with [Vite](https://vite.dev/). See the wiki's [ADR: Frontend Framework](../../../wiki/ADR-Frontend-Framework) for why.

This is a separate Node project from the Open Liberty backend (`/pom.xml`, `/src/main/java`) — it runs on its own dev server and talks to the backend over REST. See [docs/api-expectations.md](docs/api-expectations.md) for how the two connect locally and in production.

## Prerequisites

- [Node.js](https://nodejs.org/) 22+ and npm (comes with Node)
- New to JavaScript/Web Components/Carbon? Start with the [Front-End team onboarding page](../../../wiki/Team-Front-End) on the wiki before diving into this repo.
- New to git/GitHub? See [Branching and Pull Requests](../../../wiki/Branching-and-Pull-Requests) on the wiki for how we work in this repo.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if needed
```

## Running things

| Command | What it does |
|---|---|
| `npm run dev` | Starts the app's own dev server (default `http://localhost:5173`), live-reloading. |
| `npm run storybook` | Starts Storybook (`http://localhost:6006`) — the component explorer/playground. Use this while building or reviewing individual components. |
| `npm run build` | Production build of the app to `dist/` (git-ignored). |
| `npm run build-storybook` | Static build of Storybook to `storybook-static/` (git-ignored) — this is what gets published to GitHub Pages by CI, and what `npm run chromatic` would publish to Chromatic if/when we adopt it. |
| `npm test` | Runs the frontend's unit/component tests and Storybook story smoke tests once with [Vitest](https://vitest.dev/) — see [docs/frontend-testing.md](docs/frontend-testing.md). |
| `npm run test:unit` | Just the fast jsdom unit/component tests (use this while developing/TDD). |
| `npm run test:storybook` | Just the Storybook story smoke tests (real Chromium via Playwright). |
| `npm run test:watch` | Same tests, re-running on change while you work. |
| `npm run test:ui` | Same tests, in a browser UI instead of a terminal — good starting point if new to testing. |
| `npm run test:coverage` | Runs the tests once with a coverage report. |
| `npm run test:a11y` | Runs every Storybook story headlessly and checks it renders + passes accessibility checks (via the Storybook a11y addon). QA and usability review guidance lives in the [project wiki](../../wiki/Decisions). |
| `npm run test:happo` | Builds Storybook and runs Happo visual regression and accessibility snapshots. Requires `HAPPO_API_KEY` and `HAPPO_API_SECRET`. |
| `npm run chromatic` | Publishes a Storybook build to [Chromatic](https://www.chromatic.com/) for visual regression review. **Not an adopted/required step yet**; see the [CI/CD Pipeline ADR](../../wiki/ADR-CI-CD-Pipeline). Requires a `CHROMATIC_PROJECT_TOKEN` if you do try it. |

## Where things live

```
frontend/
├── pages/              # every page's HTML (one file per page; nested folders allowed)
│   └── _partials/      # shared <head> and header/side-nav shell, pulled in with <!-- @include -->
├── src/                # the actual app
│   ├── app/            # boot.js / boot-authed.js: the setup every page loads first
│   ├── pages/          # one script per page (just that page's wiring)
│   ├── components/     # one folder per component (tag name, .js, .test.js, .stories.js together)
│   │   └── shared/     # app-wide components (nav header, side nav, modal, brand)
│   ├── config/         # routes.js: the page route list
│   ├── api/  auth/     # fetch wrapper for the backend; token storage and login guard
│   ├── styles/         # global page layout and application styles
│   └── index.js        # shared entry for the logged-out pages
├── stories/            # Storybook stories for Carbon components, foundations, and page layouts
├── scripts/            # lint checks and the HTML partials plugin
├── .storybook/         # Storybook config
└── docs/               # frontend-specific docs (this folder)
```

### Adding a page

Create `pages/<name>.html` (copy `pages/people.html`) and `src/pages/<name>.js` (start it with
`import "../app/boot-authed.js";`). Nothing else needs configuring: every HTML file under `pages/` is built,
and is served at `/<name>` with no `.html`. Details in [docs/frontend-structure.md](docs/frontend-structure.md).

See [docs/README.md](docs/README.md) for the code references kept with the frontend and links to
topics that belong in the project wiki.

## Local documentation

- [docs/frontend-structure.md](docs/frontend-structure.md) — where HTML pages, components, stories, and styles live.
- [docs/api-expectations.md](docs/api-expectations.md) — the current frontend/backend contract.
- [docs/clarity-unmoderated-testing.md](docs/clarity-unmoderated-testing.md) — the production analytics integration available to usability.
- [docs/frontend-testing.md](docs/frontend-testing.md) — how to write and run the frontend's local unit/component tests (Vitest + Testing Library).

Shared architecture decisions, QA and usability guidance, deployment policy, Storybook policy, and
team workflow belong in the project wiki; see [docs/README.md](docs/README.md) for the ownership map.

## Contributing

Standard repo workflow applies — see [Branching and Pull Requests](../../../wiki/Branching-and-Pull-Requests) on the wiki. Changes under `/frontend/` route to the Frontend team via [CODEOWNERS](../.github/CODEOWNERS).
