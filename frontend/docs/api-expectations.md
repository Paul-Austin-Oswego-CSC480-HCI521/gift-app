# API expectations (Frontend → Backend)

This is what the Frontend expects from the Open Liberty backend, written down early so Backend (Andrew and the rest of the Backend sub-team) can build against it as they stand up services. It's **expectations, not a finalized contract** — Backend hasn't built anything yet, so treat this as a starting point to discuss/adjust together, not a spec being imposed. Update this doc as real endpoints land and shapes solidify.

## Local dev: two separate servers

The frontend runs on its own Node/Vite dev server (`npm run dev`, default `http://localhost:5173`), completely separate from Open Liberty (`mvn liberty:dev`, default `http://localhost:9080`). This is normal for a decoupled SPA, but it means:

- **CORS:** Open Liberty's local config needs to allow requests from the Vite dev origin (`http://localhost:5173`). Without this, the browser will block API calls with a CORS error even though both servers are running fine. This only matters for local dev — production CORS config is a separate, later discussion tied to the [ADR: Deployment Target](../../../../wiki/ADR-Deployment-Target).
- **Base URL is configurable, not hardcoded:** the frontend reads the backend's URL from an env var, `VITE_API_BASE_URL` (see `/frontend/.env.example`), defaulting to `http://localhost:9080`. Backend doesn't need to match a hardcoded frontend assumption about ports/host.

## Auth

Per the course's JWT requirement: the frontend expects to send a bearer token on authenticated requests:

```
Authorization: Bearer <token>
```

This doc doesn't prescribe how Backend issues/validates that token (that's Backend's design space) — just the shape the frontend needs to consume: get a token from somewhere (login endpoint, presumably), attach it as a Bearer token on subsequent requests. See `/frontend/src/api/client.js` for how the frontend currently expects to attach it.

## Request/response shape (placeholder — TBD as real endpoints land)

- JSON in, JSON out.
- Error responses: shape not yet defined — Backend, propose something (e.g. `{ "error": "message" }` plus a real HTTP status code) and update this doc once decided.
- Resource shapes (gift, person, wishlist, etc.) aren't defined here — those depend on the data model / [ADR: Database](../../../../wiki/ADR-Database), which is Backend's call in coordination with Requirements.

## Questions / coordination

Ping in `#full-stack` or open a discussion if something here doesn't match what Backend is actually building — this doc should track reality, not the other way around.
