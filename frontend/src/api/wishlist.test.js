import { beforeEach, expect, it, vi } from "vitest";
import { loadWishlist, saveWishlistItem } from "./wishlist.js";
import { apiFetch } from "./client.js";
import { getAccessToken } from "../auth/token-store.js";
vi.mock("./client.js", () => ({ apiFetch: vi.fn() }));
vi.mock("../auth/token-store.js", () => ({ getAccessToken: vi.fn() }));
const token = `header.${btoa(JSON.stringify({ sub: "42" }))}.signature`;
beforeEach(() => { vi.resetAllMocks(); getAccessToken.mockReturnValue(token); });
it("loads the signed-in user's list", async () => {
  apiFetch.mockResolvedValue([{ id: 1 }]);
  expect(await loadWishlist()).toEqual([{ id: 1 }]);
  expect(apiFetch).toHaveBeenCalledWith("/user/42/wished_items", { token });
});
it("posts only backend-supported fields and uses PUT for edits", async () => {
  const item = { giftName: "Game", value: "12.50", priority: "High", status: "Wanted" };
  await saveWishlistItem(item);
  expect(apiFetch).toHaveBeenLastCalledWith("/user/42/wished_items", expect.objectContaining({ method: "POST", body: '{"giftName":"Game","value":"12.50"}' }));
  await saveWishlistItem({ ...item, id: 9 });
  expect(apiFetch).toHaveBeenLastCalledWith("/user/42/wished_items/9", expect.objectContaining({ method: "PUT" }));
});
it("does not request a hardcoded user when the session is missing or malformed", async () => {
  for (const value of [null, "bad-token", `h.${btoa('{"sub":"../other"}')}.s`]) {
    getAccessToken.mockReturnValue(value);
    await expect(loadWishlist()).rejects.toThrow("log in again");
  }
  expect(apiFetch).not.toHaveBeenCalled();
});
