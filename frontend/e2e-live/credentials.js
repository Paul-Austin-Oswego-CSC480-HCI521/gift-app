// The shared test account comes from environment variables. Never write them into a file.
//   export LIVE_TEST_EMAIL=...   export LIVE_TEST_PASSWORD=...
// (In a Codespace, ask a developer to add them as Codespaces secrets so they are always set.)
export function liveCredentials() {
  const email = process.env.LIVE_TEST_EMAIL;
  const password = process.env.LIVE_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "BLOCKED: LIVE_TEST_EMAIL and LIVE_TEST_PASSWORD are not set. Get the shared test account " +
        "from a developer (issue #73) and export both before running the live tests.",
    );
  }
  return { email, password };
}
