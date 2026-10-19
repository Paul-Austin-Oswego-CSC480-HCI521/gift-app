# Agent instructions

Gift App: a Java (Open Liberty, Maven) backend in `src/` and a Carbon Design System web components
frontend in `frontend/`.

- **Frontend work:** read [`frontend/AGENTS.md`](frontend/AGENTS.md) first. The key rule is
  **Carbon first**: build UI from `@carbon/web-components`, compose them into `gift-*` components,
  and never hand-roll a control Carbon already provides. `npm run lint:carbon` enforces it in CI.
- **Backend:** `./mvnw test`.
- Follow the branching and PR conventions on the project wiki, and keep the PR template
  checklist (including the AI tool use section) filled in.
