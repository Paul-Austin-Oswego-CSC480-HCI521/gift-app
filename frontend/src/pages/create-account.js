import { apiFetch } from "../api/client.js";
import "../components/gift-create-account-form/gift-create-account-form.js";

const form = document.querySelector("gift-create-account-form");

function signupErrorMessage(error) {
  if (error.status === 409) return "An account with those details already exists.";
  if (error.status === 400) return "Some of your details weren't accepted. Check them and try again.";
  if (error.status) return "We couldn't create your account. Please try again later.";
  return "Network error. Check your connection and try again.";
}

form.addEventListener("create-account-submit", async (event) => {
  const { firstName, surname, email, password } = event.detail;

  form.loading = true;
  form.errorMessage = "";

  try {
    await apiFetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, surname, email, password }),
    });

    window.location.assign("/");
  } catch (error) {
    form.errorMessage = signupErrorMessage(error);
    form.loading = false;
  }
});