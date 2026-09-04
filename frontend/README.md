# Frontend

The gift-tracker web frontend: [IBM Carbon Design System](https://carbondesignsystem.com/) via its Web Components implementation (`@carbon/web-components`), plain JavaScript, built with [Vite](https://vite.dev/). See the wiki's [ADR: Frontend Framework](../../../wiki/ADR-Frontend-Framework) for why.

This is a separate Node project from the Open Liberty backend (`/pom.xml`, `/src/main/java` once those exist) — it runs on its own dev server and talks to the backend over REST. See [docs/api-expectations.md](docs/api-expectations.md) for how the two are expected to connect (not wired up yet).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ and npm (comes with Node)
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
| `npm run build-storybook` | Static build of Storybook to `storybook-static/` (git-ignored) — what Chromatic publishes. |
| `npm run test:a11y` | Runs every Storybook story headlessly and checks it renders + passes accessibility checks (via the Storybook a11y addon). Run this before opening a PR. |
| `npm run chromatic` | Publishes a Storybook build to [Chromatic](https://www.chromatic.com/) for visual regression review. Requires a `CHROMATIC_PROJECT_TOKEN` — ask a Frontend lead. See [docs/visual-regression-review.md](docs/visual-regression-review.md). |

## Where things live

```
frontend/
├── src/            # the actual app
│   └── api/        # fetch wrapper for talking to the backend
├── stories/         # Storybook stories (co-locate with the component they demo)
├── .storybook/      # Storybook config
└── docs/            # frontend-specific docs (this folder)
```

## More docs

- [docs/carbon-conventions.md](docs/carbon-conventions.md) — how we use Carbon components, theming, and where new components/stories should go.
- [docs/accessibility-checklist.md](docs/accessibility-checklist.md) — what to check before opening a PR.
- [docs/visual-regression-review.md](docs/visual-regression-review.md) — how Chromatic fits into review today (manual) and later (once CI adopts it).
- [docs/api-expectations.md](docs/api-expectations.md) — what the frontend expects from the Open Liberty backend (CORS, auth header, env vars).

## Contributing

Standard repo workflow applies — see [Branching and Pull Requests](../../../wiki/Branching-and-Pull-Requests) on the wiki. Changes under `/frontend/` route to the Frontend team via [CODEOWNERS](../.github/CODEOWNERS).
