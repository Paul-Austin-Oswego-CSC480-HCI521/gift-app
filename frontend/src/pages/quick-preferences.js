import "../app/boot-authed.js";
import "../components/gift-quick-preferences/gift-quick-preferences.js";
import { loadPreferences, savePreferences } from "../api/preferences.js";
import { clearAccessToken } from "../auth/token-store.js";
import { readPreferences } from "../components/gift-full-preferences/full-preferences-model.js";

const page = document.querySelector("gift-quick-preferences");

page.addEventListener("preferences-save", async ({ detail }) => {
  if (page.saving) return;
  page.saving = true;
  page.error = "";

  try {
    const existing = readPreferences(await loadPreferences());
    await savePreferences({
      ...existing,
      "Favorite Colors": detail["favorite-color"],
      "Shirt Size": detail["shirt-size"],
      "Pant Size": detail["pant-size"],
      "Shoe Size": detail["shoe-size"],
      "Jacket Size": detail["jacket-size"],
      Likes: detail.likes,
      Dislikes: detail.dislikes,
      Interests: detail.interests,
    });
    window.location.assign("/dashboard");
  } catch (error) {
    if (error.status === 401) {
      clearAccessToken();
      window.location.replace("/");
    } else {
      page.error = "Your entries are still here. Check your connection and try again.";
    }
  } finally {
    page.saving = false;
  }
});
