// Runs once before any live test. Wakes the Render backend and stops the run with a clear message
// if it never wakes, so a sleeping server is reported as BLOCKED, not as a failed test.
const PING_URL = process.env.LIVE_API_PING ?? "https://gift-app-rppl.onrender.com/gift-app/api/ping";
const LOGIN_URL = process.env.LIVE_API_LOGIN ?? PING_URL.replace(/\/ping$/, "/auth/login");
const WAKE_TIMEOUT_MS = 120_000;

// The ping answers before the database is awake, so the first real login can hang. Send one login
// (the same call the page makes) and wait for any answer below 500: even a 401 proves the database
// responded. Never logs the credentials.
async function warmDatabase() {
  const started = Date.now();
  const body = JSON.stringify({
    email: process.env.LIVE_TEST_EMAIL ?? "warmup@example.invalid",
    password: process.env.LIVE_TEST_PASSWORD ?? "warmup",
  });
  while (Date.now() - started < WAKE_TIMEOUT_MS) {
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(30_000),
      });
      if (response.status < 500) {
        console.log(`Database is awake (${Math.round((Date.now() - started) / 1000)}s)`);
        return;
      }
    } catch {
      // timed out or refused: keep waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  }
  console.log("Warning: the login endpoint did not answer in time; the first test may be slow.");
}

export default async function globalSetup() {
  const started = Date.now();
  let lastProblem = "no response";
  while (Date.now() - started < WAKE_TIMEOUT_MS) {
    try {
      const response = await fetch(PING_URL, { signal: AbortSignal.timeout(20_000) });
      if (response.ok) {
        console.log(`Backend is awake (${Math.round((Date.now() - started) / 1000)}s): ${PING_URL}`);
        await warmDatabase();
        return;
      }
      lastProblem = `HTTP ${response.status}`;
    } catch (error) {
      lastProblem = error.name === "TimeoutError" ? "timed out" : error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  }
  throw new Error(
    [
      "",
      "BLOCKED: the backend did not wake up, so no live test was run.",
      `  Checked ${PING_URL} for ${WAKE_TIMEOUT_MS / 1000}s. Last problem: ${lastProblem}.`,
      "  The server is automatically active at 8pm EST. Try again then, and report this run as",
      "  blocked (not passed, not failed) if it still does not respond.",
      "",
    ].join("\n"),
  );
}
