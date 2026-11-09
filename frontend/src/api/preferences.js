import { apiFetch } from "./client.js";
import { getAccessToken, getUserId } from "../auth/token-store.js";
import { fields, serializePreference } from "../components/gift-full-preferences/full-preferences-model.js";
function session() {
  const id = getUserId(), token = getAccessToken();
  if (!id || !token) throw Object.assign(new Error("Please log in again."), { status: 401 });
  return { path: `/user/${encodeURIComponent(id)}/attributes`, token };
}
export async function loadPreferences() {
  const { path, token } = session();
  return (await apiFetch(path, { token })) ?? [];
}
export async function savePreferences(values) {
  const { path, token } = session();
  // Refresh IDs so retrying a partial save cannot duplicate newly created fields.
  const existing = await loadPreferences();
  for (const { name } of fields) {
    const value = serializePreference(values[name]);
    const row = existing.find(row => row.attribute_Name === name);
    if (value === (row?.value ?? "")) continue;
    if (!value) {
      if (row) await apiFetch(`${path}/${row.id}`, { token, method: "DELETE" });
    } else {
      await apiFetch(row ? `${path}/${row.id}` : path, {
        token, method: row ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attribute_Name: name, value }),
      });
    }
  }
}
