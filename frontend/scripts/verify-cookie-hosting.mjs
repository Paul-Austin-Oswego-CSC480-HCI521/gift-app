import assert from "node:assert/strict";
import { chromium } from "playwright";

const pageUrl = new URL(process.env.COOKIE_TEST_PAGE);
const apiPath = process.env.COOKIE_TEST_API_PATH ?? "/api";
const { COOKIE_TEST_EMAIL: email, COOKIE_TEST_PASSWORD: password } = process.env;
const cookieName = "gift_access_token";

assert.equal(pageUrl.protocol, "https:");
assert.ok(!pageUrl.username && !pageUrl.password, "Use a URL without credentials");
assert.match(apiPath, /^\/(?!\/)[\w/-]*\w$/, "Use a same-origin API path without a trailing slash");
assert.ok(email && password, "Set the synthetic QA account email and password");

const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  assert.equal((await page.goto(pageUrl.href)).status(), 200, "Test page should load");

  async function request(path, options) {
    assert.equal(new URL(page.url()).origin, pageUrl.origin);
    return page.evaluate(async ({ url, options }) => {
      const response = await fetch(url, { ...options, redirect: "error" });
      const isJson = response.headers.get("content-type")?.includes("application/json");
      return {
        status: response.status,
        cacheControl: response.headers.get("cache-control"),
        bodyKeys: isJson && response.ok ? Object.keys(await response.clone().json()) : [],
        userId: isJson && response.ok ? (await response.json())?.userId : undefined,
      };
    }, { url: apiPath + path, options });
  }

  const post = (body) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const login = await request("/auth/login", post({ email, password }));
  assert.equal(login.status, 200, "Login should succeed");
  assert.deepEqual(login.bodyKeys, ["userId"], "Login JSON should contain only userId");
  assert.match(login.cacheControl ?? "", /\bno-store\b/);
  assert.ok(Number.isSafeInteger(login.userId));

  const cookie = (await context.cookies(pageUrl.href)).find(({ name }) => name === cookieName);
  assert.ok(cookie, "Browser should store the login cookie");
  assert.equal(cookie.domain, pageUrl.hostname);
  assert.equal(cookie.path, "/");
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.secure, true);
  assert.equal(cookie.sameSite, "Strict");
  assert.equal(await page.evaluate(name => document.cookie.includes(name + "="), cookieName), false);

  const protectedPath = `/user/${login.userId}/person`;
  const people = await request(protectedPath);
  assert.equal(people.status, 200);
  assert.match(people.cacheControl ?? "", /\bno-store\b/);
  await page.reload();
  assert.equal((await request(protectedPath)).status, 200, "Session should survive reload");

  assert.equal((await request("/auth/logout", post({}))).status, 204);
  assert.equal((await context.cookies(pageUrl.href)).some(({ name }) => name === cookieName), false);
  assert.equal((await request(protectedPath)).status, 401);
  console.log("PASS: cookie protections, protected request, reload, and logout");
} finally {
  await browser.close();
}
