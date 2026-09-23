import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./client.js";

function mockFetchOnce(response) {
  global.fetch = vi.fn().mockResolvedValue(response);
  return global.fetch;
}

describe("apiFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete global.fetch;
  });

  it("returns parsed JSON on a successful response", async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, name: "Alex" }),
    });

    const result = await apiFetch("/people/1");

    expect(result).toEqual({ id: 1, name: "Alex" });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:9080/people/1",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
  });

  it("returns an empty parsed body when the response has no content", async () => {
    mockFetchOnce({
      ok: true,
      status: 204,
      json: async () => null,
    });

    const result = await apiFetch("/people");

    expect(result).toBeNull();
  });

  it("throws with the path and status when the response is not ok", async () => {
    mockFetchOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "not found" }),
    });

    await expect(apiFetch("/people/missing")).rejects.toThrow(
      "API request to /people/missing failed: 404",
    );
  });

  it("sets the Accept header and omits Authorization when no token is given", async () => {
    const fetchMock = mockFetchOnce({ ok: true, status: 200, json: async () => ({}) });

    await apiFetch("/ping");

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.get("Accept")).toBe("application/json");
    expect(options.headers.get("Authorization")).toBeNull();
  });

  it("attaches a Bearer Authorization header when a token is given", async () => {
    const fetchMock = mockFetchOnce({ ok: true, status: 200, json: async () => ({}) });

    await apiFetch("/people", { token: "abc123" });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.get("Authorization")).toBe("Bearer abc123");
  });

  it("forwards method and body options to fetch", async () => {
    const fetchMock = mockFetchOnce({ ok: true, status: 201, json: async () => ({ id: 2 }) });

    await apiFetch("/people", { method: "POST", body: JSON.stringify({ name: "Sam" }) });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.body).toBe(JSON.stringify({ name: "Sam" }));
  });
});
