// Record a Playwright test by clicking through the app. Run it with:
//
//   npm run record -- <scenario>        for example: npm run record -- people-empty
//   npm run record -- --list            shows every scenario
//   npm run record -- people --url=/upcoming-dates   start on a different page
//
// It opens a browser on the app with the same fake API and sign-in state the tests use (see
// e2e/fixtures/), then opens the Playwright Inspector. Click Record in the Inspector and use the
// app: the steps you click appear as code. The terminal prints the lines to paste above them.
// Needs a graphical display. On your own computer that is just your screen. In a Codespace, open the
// virtual desktop first (port 6080, "Desktop (noVNC)", password vscode) and run this from a Codespace
// terminal: the browser and the Inspector appear in that tab.
import { spawn } from "node:child_process";
import { chromium, selectors } from "@playwright/test";
import { mockApi } from "../e2e/fixtures/api.js";
import { signIn } from "../e2e/fixtures/auth.js";

const PORT = 5173;
const ORIGIN = `http://localhost:${PORT}`;

// One entry per scenario: where to start, whether the user is signed in, and which API responses to
// change. `overrides` are the same values the tests pass to mockApi (see the README).
const scenarios = {
  login: { url: "/", about: "Login page, signed out" },
  "login-fail": { url: "/", overrides: { login: { status: 401, body: {} } }, about: "Login page, the server rejects the password" },
  "create-account": { url: "/create-account", about: "Create account page, signed out" },
  "signup-conflict": { url: "/create-account", overrides: { signup: { status: 409 } }, about: "Create account, the email already exists" },
  "signed-out": { url: "/dashboard", about: "Open a signed-in page while signed out (you get sent to login)" },
  "not-found": { url: "/no-such-page", about: "A page that does not exist" },

  dashboard: { url: "/dashboard", signedIn: true, about: "Dashboard with people, dates and gifts" },
  "dashboard-error": { url: "/dashboard", signedIn: true, overrides: { user: { status: 500 } }, about: "Dashboard, the server fails" },
  "session-expired": { url: "/dashboard", signedIn: true, overrides: { user: { status: 401 } }, about: "Dashboard, the sign-in has expired (you get sent to login)" },
  "people-expired": { url: "/people", signedIn: true, overrides: { people: { status: 401 } }, about: "People page, the sign-in has expired (you get sent to login)" },
  "upcoming-dates-expired": { url: "/upcoming-dates", signedIn: true, overrides: { people: { status: 401 } }, about: "Upcoming dates, the sign-in has expired" },
  "preferences-expired": { url: "/full-preferences", signedIn: true, overrides: { preferences: { status: 401 } }, about: "Preferences, the sign-in has expired" },
  "add-gift-error": { url: "/dashboard", signedIn: true, overrides: { addGift: { status: 500 } }, about: "Dashboard, adding a gift fails" },

  people: { url: "/people", signedIn: true, about: "People page with 5 people" },
  "people-empty": { url: "/people", signedIn: true, overrides: { people: { body: [] } }, about: "People page with nobody added yet" },
  "people-error": { url: "/people", signedIn: true, overrides: { people: { status: 500 } }, about: "People page, the server fails" },
  "people-slow": { url: "/people", signedIn: true, overrides: { people: { delay: 3000 } }, about: "People page, the server takes 3 seconds" },
  "people-add-error": { url: "/people", signedIn: true, overrides: { addPerson: { status: 500 } }, about: "People page, adding a person fails" },
  profile: { url: "/gift-people-profile?personId=1", signedIn: true, about: "Profile of the first person, with gifts" },
  "profile-invalid": { url: "/gift-people-profile?personId=abc", signedIn: true, about: "Profile with a bad person id in the address" },
  "profile-missing": { url: "/gift-people-profile?personId=99", signedIn: true, overrides: { person: { status: 404 } }, about: "Profile of a person that does not exist" },

  "upcoming-dates": { url: "/upcoming-dates", signedIn: true, about: "Upcoming dates with 3 occasions" },
  "upcoming-dates-empty": { url: "/upcoming-dates", signedIn: true, overrides: { people: { body: [] } }, about: "Upcoming dates with none" },
  "upcoming-dates-error": { url: "/upcoming-dates", signedIn: true, overrides: { people: { status: 500 } }, about: "Upcoming dates, the server fails" },

  wishlist: { url: "/my-wishlist", signedIn: true, about: "Wish list with 9 items" },
  "wishlist-empty": { url: "/my-wishlist", signedIn: true, overrides: { wishlist: { body: [] } }, about: "Wish list with nothing on it" },
  "wishlist-error": { url: "/my-wishlist", signedIn: true, overrides: { wishlist: { status: 500 } }, about: "Wish list, the server fails" },
  "wishlist-save-error": { url: "/my-wishlist", signedIn: true, overrides: { saveWishlistItem: { status: 500 } }, about: "Wish list, saving an item fails" },

  preferences: { url: "/full-preferences", signedIn: true, about: "Preferences with saved values" },
  "preferences-first-time": { url: "/full-preferences", signedIn: true, overrides: { preferences: { status: 404 } }, about: "Preferences for a user who has never saved any" },
  "preferences-conflict": { url: "/full-preferences", signedIn: true, overrides: { preferences: { status: 404 }, createPreferences: { status: 409 } }, about: "Preferences, the first save conflicts (the page retries)" },
  "preferences-error": { url: "/full-preferences", signedIn: true, overrides: { preferences: { status: 500 } }, about: "Preferences, loading fails" },
  "quick-preferences": { url: "/quick-preferences", signedIn: true, about: "Quick preferences form" },
};

const [name, ...flags] = process.argv.slice(2);

function listScenarios() {
  console.log("\nScenarios (use one name after `npm run record --`):\n");
  const width = Math.max(...Object.keys(scenarios).map((key) => key.length));
  for (const [key, value] of Object.entries(scenarios)) console.log(`  ${key.padEnd(width)}  ${value.about}`);
  console.log("");
}

if (!name || name === "--list" || !scenarios[name]) {
  if (name && name !== "--list") console.log(`\nNo scenario called "${name}".`);
  listScenarios();
  process.exit(name && name !== "--list" ? 1 : 0);
}

const { url: defaultUrl, signedIn = false, overrides = {} } = scenarios[name];
const urlFlag = flags.find((flag) => flag.startsWith("--url="));
const url = urlFlag ? urlFlag.slice("--url=".length) : defaultUrl;
const headless = flags.includes("--headless"); // only to check the setup; the Inspector needs a window

// Print the lines to paste at the top of the spec file.
const pasteLines = [
  `import { test, expect, signIn, mockApi } from "./fixtures/index.js";`,
  ``,
  `test("describe what this test checks", async ({ page }) => {`,
  `  // calls lists every API request the page makes, in case a test needs to check one`,
  `  const { calls } = await mockApi(page${Object.keys(overrides).length ? `, ${JSON.stringify(overrides)}` : ""});`,
  ...(signedIn ? [`  await signIn(page);`] : []),
  `  await page.goto("${url}");`,
  `  // paste the recorded steps here`,
  `});`,
];

async function isUp() {
  try {
    return (await fetch(ORIGIN)).ok;
  } catch {
    return false;
  }
}

let server;
if (!(await isUp())) {
  console.log("Starting the app...");
  // Run Vite directly (not through npx) so killing it really stops the server.
  server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
  process.on("exit", () => server.kill());
  for (let i = 0; i < 120 && !(await isUp()); i++) await new Promise((resolve) => setTimeout(resolve, 500));
  if (!(await isUp())) {
    server.kill();
    console.error("The app did not start. Try `npm run dev` in another terminal, then run this again.");
    process.exit(1);
  }
}

selectors.setTestIdAttribute("data-testid"); // so recorded steps use the project's test ids
const browser = await chromium.launch({ headless });
const page = await (await browser.newContext()).newPage();
await mockApi(page, overrides);
if (signedIn) await signIn(page);
await page.goto(`${ORIGIN}${url}`);

console.log(`\nScenario: ${name}\n`);
console.log("1. In the Playwright Inspector window, click the red Record button.");
console.log("2. Click through the app. Use the toolbar's assert buttons to check what you see.");
console.log("3. Copy the recorded steps from the Inspector into your test.\n");
console.log("Your test file starts like this:\n");
console.log(pasteLines.map((line) => `    ${line}`).join("\n"));
console.log("\nClose the browser window when you are done.\n");

await page.pause();
await browser.close();
server?.kill();
