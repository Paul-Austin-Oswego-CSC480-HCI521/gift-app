import { apiFetch } from "./client.js";
import { getAccessToken } from "../auth/token-store.js";

// The backend issues numeric user IDs as JWT subjects. This only selects the URL;
// authentication and ownership are still enforced by the server.
function session() {
  const token = getAccessToken();
  try {
    const segment = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { sub } = JSON.parse(atob(segment.padEnd(Math.ceil(segment.length / 4) * 4, "=")));
    if (!/^\d+$/.test(String(sub))) throw new Error();
    return { token, path: `/user/${encodeURIComponent(sub)}/wished_items` };
  } catch {
    throw new Error("Please log in again to use your wish list.");
  }
}

export async function loadWishlist() {
  const { token, path } = session();
  return (await apiFetch(path, { token })) ?? [];
}

export async function saveWishlistItem(item) {
  const { token, path } = session();
  const editing = item.id != null;
  return apiFetch(editing ? `${path}/${encodeURIComponent(item.id)}` : path, {
    token,
    method: editing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ giftName: item.giftName, value: item.value }),
  });
}
