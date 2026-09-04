const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9080";

/**
 * Thin fetch wrapper for talking to the Open Liberty backend.
 * Not wired up to a real backend yet - see /frontend/docs/api-expectations.md.
 */
export async function apiFetch(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    throw new Error(`API request to ${path} failed: ${response.status}`);
  }
  return response.json();
}
