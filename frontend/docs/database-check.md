# Local database connection check

The Java backend already configures the Neon PostgreSQL data source in
`src/main/liberty/config/server.xml`. Use the team-approved development database
and matching role credentials. Passwordless psql login does not authenticate Java.
Do not reset shared credentials or put passwords in frontend environment files.

## Start the backend on macOS

From the repository root, in zsh:

```sh
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
read -s "POSTGRES_PASSWORD?Database password: "
echo
export POSTGRES_PASSWORD
./mvnw liberty:dev
```

The password is hidden during entry. It is inherited by Liberty; repeat this in a
new terminal session or after changing credentials and restart the backend.

## Start the frontend

In a second terminal, from the repository root:

```sh
cd frontend
npm ci
VITE_API_BASE_URL=http://localhost:9080/gift-app npm run dev -- --port 5173 --strictPort
```

`npm ci` is needed on initial setup and when dependencies change, not every launch.
Open http://localhost:5173 and click **Check database**. A successful check displays
**Database connected.** Keep port 5173 to match the backend's local CORS configuration.

The control is added only by Vite's development mode and is omitted from production
app builds. Its Storybook story is available under Development/Database Status.

## What is tested

`GET /gift-app/api/db/health` borrows a connection and runs `SELECT 1`, without
reading user records or changing any data. It closes the result, statement, and
connection, and returns non-cacheable JSON:

- HTTP 200: `{"status":"UP"}`
- HTTP 503: `{"status":"DOWN"}` if the database connection or query fails

The endpoint remains available on the backend; only the frontend control is
development-only. It exposes no credentials or database error messages.
This confirms query connectivity, not application tables, migrations, or writes.
The query timeout is five seconds; connection acquisition uses the server's data
source settings. The browser stops waiting after ten seconds.

```sh
curl -i http://localhost:9080/gift-app/api/db/health
./mvnw test
```

To check failure and recovery, stop the local backend, click again and confirm the
error message and re-enabled button; restart it and retry. A backend outage is a
network failure, whereas a reachable backend with a database failure returns 503.
Do not change shared database credentials or records to simulate an outage.

Backend unit tests cover a successful query, a failed query, an empty result,
authentication failure, and resource cleanup. Build the frontend with
`npm run build` inside `frontend/` and verify the development control is absent.
