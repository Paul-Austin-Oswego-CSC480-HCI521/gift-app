// Mocked backend for e2e tests. Responses reuse the Storybook mock data in src/mocks/, so the
// stories and the e2e tests describe the same people and gifts.
//
// Writes (POST, PUT) change an in-memory copy that lives for one mockApi() call, so a test can add
// a person and then see the list reload with them. Nothing is persisted and nothing reaches the
// real server. Tests that need real persistence belong in the live folder, not here.
import { user } from "../../src/mocks/dashboard-user.js";
import { people } from "../../src/mocks/people.js";
import { buildGiftsByPerson, buildPeopleWithGifts } from "../../src/mocks/person-gifts.js";
import { preferencesRecord } from "../../src/mocks/preferences.js";
import { wishlistItems } from "../../src/mocks/wishlist.js";

export const TEST_USER_ID = 1;

// The wishlist API reads the user id from the token's `sub` claim, so the token has to look like a
// JWT. Nothing on the frontend verifies the signature.
const base64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
export const TEST_TOKEN = [
  base64url({ alg: "none", typ: "JWT" }),
  base64url({ sub: String(TEST_USER_ID), groups: ["user"] }),
  "signature",
].join(".");

const json = (route, body, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: body === undefined ? "" : JSON.stringify(body),
  });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Registers mocked API routes on a page. Call it before page.goto(). It returns `{ calls }`, a list
 * of every API request the page made ({ method, path, body }), so a test can assert that a request
 * was or was not sent.
 *
 * Pass an override per endpoint as { status, body, delay } (delay is in milliseconds). Any part you
 * leave out keeps its default. Keys:
 *   login, signup, user, people (GET list), person (GET one), addPerson, addGift,
 *   wishlist (GET list), saveWishlistItem, preferences (GET),
 *   createPreferences (POST, the first save), savePreferences (PUT, later saves)
 * Examples:
 *   { login: { status: 401, body: {} } }
 *   { people: { body: [] } }                       empty list
 *   { user: { status: 500 } }                      failed load
 *   { people: { status: 401 } }                    expired session
 *   { preferences: { status: 404 } }               user has no preferences yet
 *   { createPreferences: { status: 409 } }         another tab created them first (the page retries as PUT)
 *   { people: { delay: 3000 } }                    slow server, for loading or cold-start states
 */
export async function mockApi(page, overrides = {}) {
  const calls = [];
  const giftsByPerson = buildGiftsByPerson();
  const peopleList = buildPeopleWithGifts(giftsByPerson);
  let wishlist = wishlistItems.map((item) => ({ ...item }));
  let savedPreferences = { ...preferencesRecord };
  let preferencesExist = true;

  // Merges the defaults for this request with the test's override, records the call, and replies.
  const handle = (key, respond) => async (route) => {
    const request = route.request();
    let body;
    try {
      body = request.postDataJSON() ?? undefined;
    } catch {
      body = undefined;
    }
    calls.push({ method: request.method(), path: new URL(request.url()).pathname, body });

    const spec = { status: 200, ...respond(request, body), ...(overrides[key] ?? {}) };
    if (spec.delay) await wait(spec.delay);
    return json(route, spec.body, spec.status);
  };

  const nextId = (rows, floor = 0) => Math.max(floor, ...rows.map((row) => row.id)) + 1;

  await page.route(
    "**/auth/login",
    handle("login", () => ({ body: { token: TEST_TOKEN, userId: TEST_USER_ID } })),
  );

  // The real endpoint answers 201 with the same { token, userId } body as login.
  await page.route(
    "**/auth/signup",
    handle("signup", () => ({ status: 201, body: { token: TEST_TOKEN, userId: TEST_USER_ID } })),
  );

  await page.route(
    /\/user\/\d+$/,
    handle("user", () => ({ body: user })),
  );

  await page.route(
    /\/user\/\d+\/person$/,
    handle("people", () => ({ body: peopleList })),
  );
  // POST /person is registered after the list route, so it runs first and passes other methods on.
  await page.route(/\/user\/\d+\/person$/, async (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    return handle("addPerson", (request, body) => {
      const added = {
        id: nextId(peopleList, people.length),
        firstName: body?.firstName ?? "",
        lastName: body?.lastName ?? "",
        fullName: body?.fullName ?? "",
        attributes: [],
        gifts: [],
      };
      peopleList.push(added);
      return { status: 201, body: added };
    })(route);
  });

  await page.route(
    /\/user\/\d+\/person\/\d+$/,
    handle("person", (request) => {
      const id = Number(new URL(request.url()).pathname.split("/").pop());
      const found = peopleList.find((person) => person.id === id);
      return found ? { body: found } : { status: 404 };
    }),
  );

  await page.route(
    /\/user\/\d+\/gift\/person\/\d+$/,
    handle("addGift", (request, body) => {
      const personId = Number(new URL(request.url()).pathname.split("/").pop());
      const person = peopleList.find((row) => row.id === personId);
      if (!person) return { status: 404 };
      const allGifts = peopleList.flatMap((row) => row.gifts);
      const added = { id: nextId(allGifts, 200), ...body };
      person.gifts.push(added);
      return { status: 201, body: added };
    }),
  );

  // List and create. The real API returns the created item (with its id) on POST.
  await page.route(/\/user\/\d+\/wished_items$/, async (route) => {
    if (route.request().method() === "POST") {
      return handle("saveWishlistItem", (request, body) => {
        const added = { id: nextId(wishlist), ...body };
        wishlist.push(added);
        return { status: 201, body: added };
      })(route);
    }
    return handle("wishlist", () => ({ body: wishlist }))(route);
  });

  // Edit. The real API answers 204 with no body.
  await page.route(
    /\/user\/\d+\/wished_items\/\d+$/,
    handle("saveWishlistItem", (request, body) => {
      const id = Number(new URL(request.url()).pathname.split("/").pop());
      if (!wishlist.some((item) => item.id === id)) return { status: 404 };
      wishlist = wishlist.map((item) => (item.id === id ? { ...item, ...body } : item));
      return { status: 204, body: undefined };
    }),
  );

  await page.route(/\/user\/\d+\/preferences$/, async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      return handle("preferences", () =>
        preferencesExist ? { body: savedPreferences } : { status: 404 },
      )(route);
    }
    // POST is the first save and PUT is every later save, so they can fail separately.
    return handle(method === "POST" ? "createPreferences" : "savePreferences", (request, body) => {
      savedPreferences = { ...body };
      preferencesExist = true;
      return { status: method === "POST" ? 201 : 200, body: savedPreferences };
    })(route);
  });

  return { calls };
}
