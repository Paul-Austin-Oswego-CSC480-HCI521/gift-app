# Frontend

The gift-tracker web frontend: [IBM Carbon Design System](https://carbondesignsystem.com/) via its Web Components implementation (`@carbon/web-components`), plain JavaScript, built with [Vite](https://vite.dev/). See the wiki's [ADR: Frontend Framework](../../../wiki/ADR-Frontend-Framework) for why.

This is a separate Node project from the Open Liberty backend (`/pom.xml`, `/src/main/java`) — it runs on its own dev server and talks to the backend over REST. See [docs/api-expectations.md](docs/api-expectations.md) for how the two are expected to connect (not wired up yet).

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
| `npm run build-storybook` | Static build of Storybook to `storybook-static/` (git-ignored) — this is what gets published to GitHub Pages by CI, and what `npm run chromatic` would publish to Chromatic if/when we adopt it. |
| `npm run test:a11y` | Runs every Storybook story headlessly and checks it renders + passes accessibility checks (via the Storybook a11y addon). Run this before opening a PR. |
| `npm run chromatic` | Publishes a Storybook build to [Chromatic](https://www.chromatic.com/) for visual regression review. **Not an adopted/required step yet** — see [docs/visual-regression-review.md](docs/visual-regression-review.md). Requires a `CHROMATIC_PROJECT_TOKEN` if you do try it. |

## Where things live

```
frontend/
├── src/                # the actual app
│   ├── index.js        # shared entry point — loads styles and registers Web Components
│   ├── components/     # reusable pieces (header, footer, gradient panel, ...)
│   ├── styles/         # global page layout and application styles
│   └── api/            # fetch wrapper for talking to the backend
├── index.html          # home page; future pages can have their own HTML entry file
├── stories/         # Storybook stories (co-locate with the component they demo)
├── .storybook/      # Storybook config
└── docs/            # frontend-specific docs (this folder)
```

See [docs/README.md](docs/README.md) for the documentation kept with the code and the
topics that belong in the project wiki.

## Local documentation

- [docs/frontend-structure.md](docs/frontend-structure.md) — where HTML pages, components, stories, and styles live.
- [docs/accessibility-checklist.md](docs/accessibility-checklist.md) — the checks to run before opening a PR.
- [docs/api-expectations.md](docs/api-expectations.md) — the current frontend/backend contract.

The longer explanations in `frontend/docs/` are implementation references or working drafts. Shared
architecture decisions, deployment policy, Storybook policy, Carbon conventions, and team workflow
belong in the project wiki; see [docs/README.md](docs/README.md) for the ownership map.

## Contributing

Standard repo workflow applies — see [Branching and Pull Requests](../../../wiki/Branching-and-Pull-Requests) on the wiki. Changes under `/frontend/` route to the Frontend team via [CODEOWNERS](../.github/CODEOWNERS).
