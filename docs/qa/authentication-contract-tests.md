# Authentication API contract tests (#61)

The existing `AuthResourceTest` and `PasswordServiceTest` run with `./mvnw test` and cover validation, invalid credentials, password hashing, and login orchestration. Their token service is mocked: those tests alone do not prove signed JWTs or the HTTP JSON contract work.

`src/test/java/auth_contract/AuthEndpointIT.java` adds opt-in tests against a real running backend:

- 200 login response, exact token/userId response fields, JSON content type and no-store caching.
- Signature checked independently using RS256 and the configured trusted JWKS, plus issuer, subject, upn, user group, issued-at, expiry, and token ID claims.
- The real protected `GET /api/user/{id}` accepts the issued token and rejects missing/tampered tokens with 401. This exercises Liberty's MP-JWT validation, not just a Java token decoder.
- Wrong password and unknown email return the same 401 body.
- Invalid JSON syntax, a wrong JSON shape, and incompatible field types return 400 over HTTP. These errors are handled by the runtime; the test does not require the resource's message for JSON parsing failures.
- Missing/null/empty fields return the documented 400 JSON message.

## Prerequisites

Use Java 21 and a running backend built from the revision under test. A valid designated synthetic test account must already exist with a BCrypt hash. The suite only logs in and reads that account; it does not seed, reset, or modify the database. It is not a load test. Coordinate with Backend/QA for the account and test environment (#73).

Use the actual deployed URLs, not Netlify. Required environment variables:

| Variable | Meaning |
| --- | --- |
| `AUTH_TEST_BASE_URL` | API base including context and `/api`, for example `https://backend.example/gift-app/api` |
| `AUTH_TEST_EMAIL` | Synthetic account email; must match the token's expected upn |
| `AUTH_TEST_PASSWORD` | That account's password, supplied privately |
| `AUTH_TEST_USER_ID` | Expected numeric database user ID |
| `AUTH_TEST_ISSUER` | Trusted issuer matching the backend JWT configuration |
| `AUTH_TEST_JWKS_URL` | Trusted public signing keys URL; current Liberty builder uses `/jwt/ibm/api/myBuilder/jwk` at the server origin |

Supply these through your shell's private environment or CI secrets. Do not commit values or put the password in command arguments. No `.env` loader is included. HTTPS is required for remote hosts. HTTP is accepted only for loopback local testing. For local self-signed HTTPS, configure a trusted JVM truststore; TLS verification is not disabled.

## Run

First run the ordinary unit suite:

```sh
./mvnw test
```

With all six variables set, run:

```sh
./mvnw -Pauth-contract test-compile failsafe:integration-test failsafe:verify
```

This command compiles the project and calls an already-running backend. It does not start/stop Liberty, deploy a WAR, or contact Neon directly. The profile turns on the integration tests; missing configuration fails instead of silently passing/skipping them. Ordinary unit runs do not execute the live suite. Avoid substituting `verify` for this command: the repository's existing lifecycle also creates/installs Liberty during pre-integration-test.

Results are under `target/failsafe-reports/`. Check the reported test count and failures; an ordinary successful unit run is not an integration pass. Do not upload secrets or returned tokens with test reports.

## Interpretation and handoff

Record tested backend commit, URL, date, and result on the PR. A failure of the protected-endpoint check may expose a JWT/authorization configuration problem even if login returns 200; report it rather than weakening the expected status. Unknown issuer, invalid signature, incorrect claims, or malformed JSON accepted as a successful login are regressions.

This suite does not test browser CORS, frontend token propagation, refresh/revocation, or load capacity. Full SVT still requires the frontend flow. Issue #61 is ready for closure only after these tests pass against the real backend and the PR is reviewed/merged.
