# Netlify Deployment & Backend/Database Integration

This guide documents how the Netlify deployments are configured and how to connect the frontend to the backend and database once they are live.

---

## 1. Netlify Setup Overview (Option 2: Two Sites)

We use two separate Netlify sites for the project:

### Site 1: Main Frontend Application
* **Branch to deploy**: `feature/ui-start` (change to `main` once merged)
* **Base directory**: `frontend`
* **Build command**: `npm run build`
* **Publish directory**: `dist`
* **Environment variables**:
  * `VITE_API_BASE_URL` = `http://localhost:9080` (or live backend API URL)

### Site 2: Storybook Component Explorer
* **Branch to deploy**: `feature/ui-start` (change to `main` once merged)
* **Base directory**: `frontend`
* **Build command**: `npm run build-storybook`
* **Publish directory**: `storybook-static`
* **Environment variables**: *(none)*

---

## 2. Deploying Branches vs. `main`

### Does Netlify work before merging to `main`?
**Yes!** You do **not** need to wait for `main` to test deployments:
1. **Branch Deployments**: You can set Netlify's **Branch to deploy** to `feature/ui-start` in Site Settings.
2. **Deploy Previews**: Whenever you open a Pull Request from `feature/ui-start` into `main`, Netlify can automatically generate a unique Deploy Preview URL for that PR.

### Production Release (After Merging to `main`):
Once `feature/ui-start` is reviewed and merged:
1. Go to **Site Settings > Build & deploy > Continuous Deployment** in Netlify for both sites.
2. Change the **Production branch** from `feature/ui-start` to `main`.
3. Future pushes to `main` will automatically trigger production builds.

---

## 3. Connecting to the Backend & Database Down the Line

Currently, the app frontend is decoupled from the Open Liberty backend and database. When the backend and database are deployed to production:

### Step 1: Update Netlify Environment Variables
1. Go to **Netlify Site Configuration > Environment variables** for **Site 1 (Main App)**.
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
