# API expectations (Frontend → Backend)

This is what the Frontend expects from the Open Liberty backend, and what the backend currently provides. It's **expectations plus a snapshot of today's behavior, not a finalized contract**; resource shapes are defined by the entity and resource classes under `src/main/java/edu/oswego/csc480/`, so check them before relying on a detail here. Update this doc when endpoints or shapes change.

## Environments

| Environment | Frontend | Backend API base URL |
| --- | --- | --- |
| Local | `http://localhost:5173` (`npm run dev`) | `http://localhost:9080/gift-app/api` (`mvn liberty:dev`) |
| Production | `https://gift-app-project.netlify.app` (Netlify) | `https://gift-app-rppl.onrender.com/gift-app/api` (Render) |
| Netlify Deploy Preview | `https://deploy-preview-<n>--gift-app-project.netlify.app` | Cannot call the API: the backend's CORS allows only the production origin |

All API paths are under the `/gift-app` context root and the `/api` JAX-RS application path. For example the health check is `GET /gift-app/api/ping`.

## Two separate servers, two origins

The frontend is a decoupled SPA served separately from Open Liberty in every environment, so the browser makes cross-origin requests and CORS must allow the frontend's origin.

- **Local CORS:** the Maven build sets `cors.allowed.domain` to `http://localhost:5173` (the Vite dev origin) in `pom.xml`.
- **Production CORS:** Render's `FRONTEND_ORIGIN` environment variable is the single allowed origin (the production Netlify URL, no trailing slash). Liberty's `cors` element in `server.xml` reads it through `cors.allowed.domain`. Origins that are not listed, including Netlify Deploy Previews, are blocked by the browser. Do not allow all origins. See the [ADR: Deployment Target](../../../../wiki/ADR-Deployment-Target).
- **Base URL is configurable:** the frontend reads `VITE_API_BASE_URL` (see `/frontend/.env.example`) and appends request paths such as `/auth/login` to it, so the value must include the context root and application path: `.../gift-app/api`. When it is unset, `src/api/client.js` defaults to `http://localhost:9080/gift-app/api`.
- **Production value:** `VITE_API_BASE_URL` is set in the Netlify UI, not in `netlify.toml`. Vite inlines it at build time, so changing it requires a rebuild.

## Auth

Per the course's JWT requirement, the frontend signs in once and sends a bearer token on authenticated requests.

`POST /auth/login` with JSON `{ "email": "...", "password": "..." }` returns:

- `200` with `{ "token": "<jwt>", "userId": <number> }`
- `400` with `{ "message": "Email and password are required." }`
- `401` with `{ "message": "Invalid email or password." }`

The frontend then sends the token on authenticated requests:

```
Authorization: Bearer <token>
```

- `/auth/login` and `/ping` are public. The `/user/...` resources are intended to require a valid token with the `user` role.
- The token is stored in `sessionStorage` by `src/auth/token-store.js`. That file notes this is a stopgap because scripts can read it; a better approach is still open.
- The login page ignores "remember me" until the backend supports persistent sessions.
- Tokens are signed with Liberty's auto-generated keys, so a backend restart or redeploy invalidates existing tokens and users must log in again. The issuer comes from the `jwt.issuer` setting (`JWT_ISSUER` on Render).
- `src/api/client.js` (`apiFetch`) attaches the token when a `token` option is passed, and throws an `Error` with a `status` property on non-2xx responses.

## Endpoints that exist today

These are the JAX-RS resources in the backend (all JSON in and out); see the classes for request and response bodies.

| Path | Methods | Purpose |
| --- | --- | --- |
| `/ping` | GET | Health check; returns `{ "status": "OK" }`. Public. |
| `/auth/login` | POST | Email/password login. Public. |
| `/user`, `/user/{id}` | GET, POST, PUT, DELETE | Users |
| `/user/{uid}/attributes[/{aid}]` | GET, POST, PUT, DELETE | A user's attributes |
| `/user/{uid}/person[/{pid}]` | GET, POST, PUT, DELETE | People the user gives gifts to |
| `/user/{uid}/person/{pid}/attributes[/{aid}]` | GET, POST, PUT, DELETE | A person's attributes |
| `/user/{uid}/gift[/{gid}]`, `/user/{uid}/gift/person/{pid}` | GET, POST, PUT, DELETE | Gifts, directly or per person |
| `/user/{uid}/gift/{gid}/status` | GET, POST, PUT, DELETE | A gift's status |
| `/user/{uid}/gift/{gid}/occasion` | GET, POST, PUT, DELETE | A gift's occasion |

The `/db` development endpoint exists only in local builds; the production image removes it.

## Request/response shape

- JSON in, JSON out.
- Login errors use `{ "message": "..." }` with a real HTTP status. Other resources do not yet share one error shape; prefer the HTTP status code and treat bodies as optional until Backend standardizes this.
- Resource shapes (gift, person, user, and so on) come from the entity classes and the database schema ([ADR: Database](../../../../wiki/ADR-Database)), which is Backend's call in coordination with Requirements.
- The frontend currently uses a hard-coded user ID on some pages (for example `dashboard.js` and the gift modal); it should use the `userId` returned by login.

## Questions / coordination

Ping in `#full-stack` or open a discussion if something here doesn't match what Backend is actually building — this doc should track reality, not the other way around.
