import { apiFetch } from "./client.js";
import { getAccessToken, getUserId } from "../auth/token-store.js";
import { serializePreferences } from "../components/gift-full-preferences/full-preferences-model.js";
function session() {
  const id = getUserId(), token = getAccessToken();
  if (!id || !token) throw Object.assign(new Error("Please log in again."), { status: 401 });
  return { path: `/user/${encodeURIComponent(id)}/attributes`, token };
}
export async function loadPreferences() {
  const { path, token } = session();
  try { return await apiFetch(path, { token }); }
  catch (error) {
    // The new API returns 404 when this user has no preferences yet.
    if (error.status === 404) return null;
    throw error;
  }
}
export async function savePreferences(values) {
  const { path, token } = session();
  const existing = await loadPreferences();
  const options = { token, method: existing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(serializePreferences(values)) };
  try { return await apiFetch(path, options); }
  catch (error) {
    // Another tab may have created the record since our GET.
    if (!existing && error.status === 409) return apiFetch(path, { ...options, method: "PUT" });
    throw error;
  }
}
