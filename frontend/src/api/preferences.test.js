import { beforeEach, expect, it, vi } from "vitest";
vi.mock("./client.js", () => ({ apiFetch: vi.fn() }));
vi.mock("../auth/token-store.js", () => ({ getUserId: () => "42", getAccessToken: () => "token" }));
import { apiFetch } from "./client.js";
import { loadPreferences, savePreferences } from "./preferences.js";
beforeEach(() => vi.resetAllMocks());
it("loads the preferences object and treats missing preferences as a blank form", async () => {
  apiFetch.mockResolvedValueOnce({ favoriteColor: "Teal" });
  expect(await loadPreferences()).toEqual({ favoriteColor: "Teal" });
  apiFetch.mockRejectedValueOnce({ status: 404 });
  expect(await loadPreferences()).toBeNull();
  apiFetch.mockRejectedValueOnce({ status: 401 });
  await expect(loadPreferences()).rejects.toEqual({ status: 401 });
});
it("creates one complete preferences record using backend field names", async () => {
  apiFetch.mockRejectedValueOnce({ status: 404 }).mockResolvedValueOnce({ id: 1 });
  await savePreferences({ "Favorite Colors": "Teal", "Preferred Fit": "Loose", "Style Description": "Vintage", Likes: "Books" });
  const [path, options] = apiFetch.mock.calls[1];
  expect(path).toBe("/user/42/preferences");
  expect(options.method).toBe("POST");
  expect(options.token).toBe("token");
  expect(JSON.parse(options.body)).toMatchObject({ favoriteColor: "Teal", preferredFit: "Loose", styleDescription: "Vintage", likes: "Books", dislikes: "" });
});
it("updates the record and clears individual fields without deleting it", async () => {
  apiFetch.mockResolvedValueOnce({ id: 1, favoriteColor: "Blue" }).mockResolvedValueOnce(null);
  await savePreferences({ "Favorite Colors": "" });
  expect(apiFetch.mock.calls[1][1].method).toBe("PUT");
  expect(JSON.parse(apiFetch.mock.calls[1][1].body).favoriteColor).toBe("");
  expect(apiFetch).toHaveBeenCalledTimes(2);
});
it("updates on a creation conflict and propagates other save failures", async () => {
  apiFetch.mockRejectedValueOnce({ status: 404 }).mockRejectedValueOnce({ status: 409 }).mockResolvedValueOnce(null);
  await savePreferences({ Likes: "Books" });
  expect(apiFetch.mock.calls[2][1].method).toBe("PUT");
  apiFetch.mockResolvedValueOnce({ id: 1 }).mockRejectedValueOnce({ status: 500 });
  await expect(savePreferences({})).rejects.toEqual({ status: 500 });
});
