# Cookie authentication (#160)

Local API base: `https://localhost:9443/gift-app/api`.

## API changes

- `POST /auth/login` still accepts JSON with `email` and `password`.
  Success returns `200` with only `userId` in JSON. The JWT is sent in the
  `gift_access_token` cookie instead of the response body.
- The cookie is host-only, with `Path=/`, `HttpOnly`, `Secure`, and
  `SameSite=Strict`. It is a session cookie; the existing one-hour JWT expiry
  still applies. Login does not use the separate three-day token method.
- MicroProfile JWT reads `gift_access_token` from the Cookie header. Existing
  role and ownership checks still apply.
- `POST /auth/logout` returns `204` and clears the same cookie with `Max-Age=0`.
  This removes the browser cookie but does not revoke copies of an issued JWT.
- Login, login errors, and logout use `Cache-Control: no-store`.

## Frontend handoff

Confirm the actual frontend and API URLs before deployment. Browser API requests
need a same-site route for the Strict cookie. If a proxy is used, it must forward
Cookie and Set-Cookie without removing the cookie attributes. Authenticated
responses must not be cached.

The frontend must stop reading `data.token`, storing JWTs, and building bearer
headers. It should keep the returned userId for user-scoped requests, check a
protected API response for signed-in status, and call backend logout before
clearing local user state. Same-origin fetch includes cookies by default;
requests between different origins need `credentials: "include"` and an
explicit allowed CORS origin. Use HTTPS.

Coordinate this frontend change before merging or deploying the backend. The
current token-based frontend cannot use the new response unchanged. Changing
SameSite to None would require a separate CSRF design.

## Verification

Run the existing backend tests with `./mvnw test` on Java 21. With a running local
HTTPS backend and an approved existing test account, verify:

1. Login returns `200`, only userId in JSON, and the expected cookie attributes.
2. `GET /user/{userId}/person` returns `200` with the cookie. Missing or invalid
   cookies return `401`; another user's path returns `403`.
3. Logout returns `204` and clears the cookie. The next protected request returns
   `401`.
4. Repeat through the updated frontend, including reload and an expired session.

Keep credentials, JWTs, and cookie jars private.

Reference: [Open Liberty JWT cookie configuration](https://openliberty.io/blog/2021/03/26/MP-JWT-1.2.html#accepting-jwts-in-cookies).
