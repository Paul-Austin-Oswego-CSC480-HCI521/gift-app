
import "../app/boot-authed.js";
import "../components/gifting-people-profile/gifting-people-profile.js";
import { apiFetch } from "../api/client.js";
import {
  getAccessToken,
  getUserId,
  clearAccessToken,
} from "../auth/token-store.js";

const profile = document.querySelector("gifting-people-profile");

const personId = new URLSearchParams(
  window.location.search
).get("personId");

async function loadProfile() {
  if (!personId || !/^\d+$/.test(personId)) {
    profile.loading = false;
    profile.error =
      "No valid person was selected. Please return to People.";
    return;
  }

  try {
    const userId = getUserId();
    const token = getAccessToken();

    if (!userId || !token) return;

    profile.person = await apiFetch(
      `/user/${encodeURIComponent(userId)}/person/${encodeURIComponent(personId)}`,
      { token }
    );

    profile.error = "";
  } catch (error) {
    if (error.status === 401) {
      clearAccessToken();
      window.location.replace("/");
      return;
    }

    profile.error =
      error.status === 404
        ? "This person was not found."
        : "Could not load this person's profile. Please try again.";
  } finally {
    profile.loading = false;
  }
}

loadProfile();
