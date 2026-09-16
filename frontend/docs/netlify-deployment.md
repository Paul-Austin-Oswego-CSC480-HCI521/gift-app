# Netlify Deployment & Backend/Database Integration

> **Wiki candidate:** Deployment ownership, hosting decisions, and environment policy belong in
> the project wiki. Keep this file as a short implementation reference while that material is
> consolidated there.

This guide documents how the Netlify deployment is configured and how to connect the frontend to the backend and database once they are live.

No permanent deployment target has been decided for the project as a whole — see the wiki's [ADR: Deployment Target](../../../../wiki/ADR-Deployment-Target). Netlify (for the frontend app) and GitHub Pages (for Storybook) are the current interim arrangement, not a final decision, and may change.

---

## 1. Netlify Setup Overview

There is **one** Netlify site, for the Vite frontend app only (matching [`/netlify.toml`](../../netlify.toml)):

* **Production branch**: `main`
* **Base directory**: `frontend`
* **Build command**: `npm run build`
* **Publish directory**: `dist`
* **Environment variables**:
  * `VITE_API_BASE_URL` = `http://localhost:9080` (or live backend API URL)

Storybook is **not** deployed via Netlify. It's built and published to GitHub Pages by [`.github/workflows/storybook-pages.yml`](../../.github/workflows/storybook-pages.yml) — see the wiki's [Storybook Guide](../../../../wiki/Storybook-Guide) for how that works and how to view it.

---

## 2. Deploying Branches vs. `main`

`feature/ui-start` (the branch this setup was originally configured against) has already been merged into `main` — Netlify's production branch is `main` today, so this section only matters for testing a new feature branch before it merges.

### Does Netlify work before merging to `main`?
**Yes!** You do **not** need to wait for `main` to test deployments:
1. **Branch Deployments**: You can set Netlify's **Branch to deploy** to any feature branch in Site Settings, temporarily, to test it.
2. **Deploy Previews**: Whenever you open a Pull Request into `main`, Netlify can automatically generate a unique Deploy Preview URL for that PR.

---

## 3. Connecting to the Backend & Database Down the Line


Currently, the app frontend is decoupled from the Open Liberty backend and database. When the backend and database are deployed to production:

### Step 1: Update Netlify Environment Variables
1. Go to **Netlify Site Configuration > Environment variables** for the frontend site.
2. Update `VITE_API_BASE_URL`:
   * **Old / Dev**: `http://localhost:9080`
   * **New / Prod**: `https://your-openliberty-backend.example.com` (or whatever production URL hosting Open Liberty)
3. Trigger a manual re-deploy on Netlify (or push a commit) so Vite embeds the new API endpoint URL at build time.

### Step 2: Configure CORS on Open Liberty Backend
Because the frontend (hosted on Netlify, e.g. `https://gift-app.netlify.app`) and backend are on different domains/origins:
* Configure CORS in Open Liberty (`server.xml` or microprofile headers) to accept `ORIGIN` header matching your Netlify URL:
```xml
<cors domain="/api"
      allowedOrigins="https://gift-app.netlify.app"
      allowedMethods="GET, POST, PUT, DELETE, OPTIONS"
      allowedHeaders="Authorization, Content-Type" />
```

### Step 3: Database & Auth Verification
* The Open Liberty backend handles database queries directly (via JPA/JDBC or MicroProfile Data).
* The frontend communicates purely via REST using JSON and `Authorization: Bearer <JWT_TOKEN>`.
* Verify endpoint responses in browser dev tools (Network tab) once connected.
