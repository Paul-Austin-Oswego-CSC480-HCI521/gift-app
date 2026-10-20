# Deploy the backend to Render

These files are prepared for review; the container has not yet been run on Render.
Prepared on `codex/render-deployment`, based on current `main` as fetched on
2026-10-20. The Render image excludes the development `DBTest` endpoint. Local
development and the original Dockerfile are unchanged. The Docker-specific ignore
file limits the build context; do not add secrets to the allowed source inputs.
The server is not prewarmed during image build, so runtime secrets are not needed
as Docker build arguments.

## Before deploying

- Review the current backend for public development/write endpoints and disable
  those endpoints in the deployed build. Verify authentication and ownership
  checks for protected resources.
- Keep the existing Neon database; use approved synthetic QA data.
- Run `./mvnw test` on the current backend revision.
- Start Docker Desktop and run `docker build -f Dockerfile.render -t gift-app-render .`.
  This image builds the WAR and includes the PostgreSQL driver itself.
- Verify JWT signing/validation on the container; it retains Liberty's local
  HTTPS listener for the existing JWK configuration. Automatically generated
  signing keys may change on restart, invalidating old tokens.

## Create the service

1. Sign in at https://dashboard.render.com/ and connect the GitHub repository.
2. Select **New > Web Service**, choose the reviewed backend branch, and select
   **Docker**. Leave the root directory empty; Dockerfile path is `Dockerfile.render`.
3. Choose a plan explicitly. A free service sleeps when idle and may have too
   little memory for this application; confirm resource usage before QA relies on it.
4. Add private environment values:

   | Name | Value |
   | --- | --- |
   | `POSTGRES_PASSWORD` | Existing Neon password, provided privately |
   | `FRONTEND_ORIGIN` | `https://gift-app-project.netlify.app` |
   | `KEYSTORE_PASSWORD` | A newly generated strong secret |
   | `JWT_ISSUER` | A stable issuer matching token validation; current backend uses `https://gift-app.oswego.edu` |
   | `PORT` | `10000` |

5. Set health check path to `/gift-app/api/ping` and deploy. Confirm it returns
   HTTP 200 without authentication. This is a liveness check, not proof of database readiness.
6. Record the service's assigned HTTPS URL and deployed Git commit. Test with a
   QA account that login issues a token and protected requests accept that token.
   Check database persistence and reject requests without a valid token.

The public connection uses managed HTTPS; Render forwards internally over HTTP.
The backend binds to all interfaces on the assigned port. Credentials and keys
must stay in environment settings, never in source files or build arguments.

## Connect Netlify after backend checks pass

1. In Netlify, set `VITE_API_BASE_URL` to the actual Render HTTPS URL followed by
   `/gift-app` (no trailing slash). Never leave the deployed build pointing to localhost.
2. Remove the conflicting localhost value from `netlify.toml` in the deployment PR
   and rebuild Netlify. Check the browser Network tab for the effective API address.
3. Confirm CORS accepts the frontend origin. PR preview origins need explicit
   approval/configuration before they can call this backend; do not allow all origins.
4. Verify the frontend actually calls the login API, handles failed login, stores
   the token according to the frontend contract, and uses it for protected requests.
5. Verify there are no HTTP API requests or certificate warnings. Share both URLs,
   build revisions, available workflows, and known limitations with QA.

## References

- [Render Docker deployment](https://render.com/docs/docker)
- [Render web services and HTTPS](https://render.com/docs/web-services)
- [Render free service limits](https://render.com/docs/free)
- [Liberty configuration overrides](https://openliberty.io/docs/latest/reference/config/server-configuration-overview.html)
