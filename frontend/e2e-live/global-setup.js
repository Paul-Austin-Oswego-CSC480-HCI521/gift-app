// Runs once before any live test. Wakes the Render backend and stops the run with a clear message
// if it never wakes, so a sleeping server is reported as BLOCKED, not as a failed test.
const PING_URL = process.env.LIVE_API_PING ?? "https://gift-app-rppl.onrender.com/gift-app/api/ping";
const WAKE_TIMEOUT_MS = 120_000;

export default async function globalSetup() {
  const started = Date.now();
  let lastProblem = "no response";
  while (Date.now() - started < WAKE_TIMEOUT_MS) {
    try {
      const response = await fetch(PING_URL, { signal: AbortSignal.timeout(20_000) });
      if (response.ok) {
        console.log(`Backend is awake (${Math.round((Date.now() - started) / 1000)}s): ${PING_URL}`);
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
