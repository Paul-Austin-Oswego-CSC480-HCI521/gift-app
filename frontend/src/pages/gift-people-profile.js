
import "../app/boot-authed.js";
import "../components/gift-people-profile/gift-people-profile.js";
import { apiFetch } from "../api/client.js";
import {
  getAccessToken,
  getUserId,
  clearAccessToken,
} from "../auth/token-store.js";

const profile = document.querySelector("gift-people-profile");

const personId = new URLSearchParams(
  window.location.search
).get("personId");

async function handleGiftSave(event) {
  const table = event.target;
  const gift = event.detail;

  if (!personId || !/^\d+$/.test(personId)) {
    table.saveError = "No valid person was selected.";
    return;
  }

  if (table.saving) return;

  table.saving = true;
  table.saveError = "";

  try {
    await apiFetch(
      `/user/${encodeURIComponent(getUserId())}/gift/person/${encodeURIComponent(personId)}`,
      {
        token: getAccessToken(),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gift.giftName,
          type: "gift",
          link: "",
          quantity: 1,
          status: {
            stage:
              gift.status === "Received"
                ? "purchased"
                : "updated",
          },
        }),
      }
    );

    table.closeEditor();
    await loadProfile();
  } catch (error) {
    table.saveError =
      `Could not add gift: ${error.message}`;
  } finally {
    table.saving = false;
  }
}
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

profile.addEventListener("wishlist-save", handleGiftSave);

loadProfile();
