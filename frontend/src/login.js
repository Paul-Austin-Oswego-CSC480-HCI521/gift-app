import { apiFetch } from "./api/client.js";
import { setAccessToken } from "./auth/token-store.js";

const POST_LOGIN_URL = "/dashboard";

const form = document.querySelector("gift-login-form");

form.addEventListener("login-submit", async (event) => {
  const { email, password } = event.detail;
  // TODO: event.detail.rememberMe is ignored until the backend supports persistent sessions.

  form.loading = true;
  form.errorMessage = "";

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setAccessToken(data.token);
    window.location.assign(POST_LOGIN_URL);
  } catch (error) {
    form.errorMessage =
      error.status === 401
        ? "Incorrect email or password."
        : "Something went wrong, try again.";
  } finally {
    form.loading = false;
  }
});