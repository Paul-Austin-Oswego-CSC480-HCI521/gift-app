const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9080/gift-app/api";

export async function apiFetch(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = new Error(`API request to ${path} failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
