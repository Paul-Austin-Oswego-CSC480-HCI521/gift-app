import { beforeEach, expect, it, vi } from "vitest";
vi.mock("./client.js", () => ({ apiFetch: vi.fn() }));
vi.mock("../auth/token-store.js", () => ({ getUserId: () => "42", getAccessToken: () => "token" }));
import { apiFetch } from "./client.js";
import { savePreferences } from "./preferences.js";
beforeEach(() => vi.resetAllMocks());
it("updates, creates and clears only recognized preferences", async () => {
  apiFetch.mockResolvedValueOnce([{ id: 1, attribute_Name: "Likes", value: "Old" }, { id: 2, attribute_Name: "Dislikes", value: "Old" }, { id: 3, attribute_Name: "Other", value: "Untouched" }]).mockResolvedValue(null);
  await savePreferences({ Likes: "Books", Dislikes: "", Interests: ["Music"] });
  expect(apiFetch).toHaveBeenCalledWith("/user/42/attributes/1", expect.objectContaining({ method: "PUT", body: JSON.stringify({ attribute_Name: "Likes", value: "Books" }) }));
  expect(apiFetch).toHaveBeenCalledWith("/user/42/attributes/2", expect.objectContaining({ method: "DELETE" }));
  expect(apiFetch).toHaveBeenCalledWith("/user/42/attributes", expect.objectContaining({ method: "POST" }));
  expect(apiFetch.mock.calls.some(([path]) => path.endsWith("/3"))).toBe(false);
});
it("rereads IDs after a partial save and skips fields already saved", async () => {
  apiFetch.mockResolvedValueOnce([]).mockResolvedValueOnce({ id: 1 }).mockRejectedValueOnce(new Error("offline"));
  await expect(savePreferences({ Likes: "Books", Dislikes: "Noise" })).rejects.toThrow("offline");
  apiFetch.mockResolvedValueOnce([{ id: 1, attribute_Name: "Likes", value: "Books" }]).mockResolvedValue(null);
  await savePreferences({ Likes: "Books", Dislikes: "Noise" });
  expect(apiFetch.mock.calls.filter(([, options]) => options?.body === JSON.stringify({ attribute_Name: "Likes", value: "Books" }))).toHaveLength(1);
});
