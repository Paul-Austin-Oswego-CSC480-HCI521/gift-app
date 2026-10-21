// Bootstrap for pages that require a signed-in user: redirects to login without a token,
// then loads the shared shell. Every page behind login should import this first.
import "../auth/require-auth.js";
import "./boot.js";
