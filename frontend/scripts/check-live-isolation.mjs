// Fails if the live (real-backend) tests could run in CI. Rules:
//   - e2e/ (mocked API) runs in CI; e2e-live/ (real server) never does.
//   - No GitHub workflow may mention e2e-live, test:e2e:live, record:live or playwright.live.config.
//   - The main Playwright config must keep testDir at ./e2e and never mention the live folder or config.
//   - The `test:e2e` script must not point at the live config.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const workflows = join(root, "..", ".github", "workflows");
const forbidden = /e2e-live|test:e2e:live|record:live|playwright\.live\.config/;
const problems = [];

for (const file of readdirSync(workflows).filter((name) => /\.ya?ml$/.test(name))) {
  readFileSync(join(workflows, file), "utf8")
    .split("\n")
    .forEach((line, index) => {
      if (forbidden.test(line)) problems.push(`.github/workflows/${file}:${index + 1} runs or mentions live tests: ${line.trim()}`);
    });
}

const config = readFileSync(join(root, "playwright.config.js"), "utf8");
if (!/testDir:\s*["']\.\/e2e["']/.test(config)) problems.push('playwright.config.js: testDir must be "./e2e".');
if (forbidden.test(config.replace(/\/\/.*$/gm, ""))) problems.push("playwright.config.js must not reference the live tests.");

const scripts = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).scripts;
if (/live/.test(scripts["test:e2e"] ?? "")) problems.push('package.json: "test:e2e" must not run the live config.');

if (problems.length) {
  console.error("Live e2e tests must never run in CI:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log("OK: CI runs e2e/ only; e2e-live/ is not reachable from any workflow or the main config.");
