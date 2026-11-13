import "../app/boot-authed.js";
import "../components/gift-full-preferences/gift-full-preferences.js";
import { loadPreferences, savePreferences } from "../api/preferences.js";
import { readPreferences } from "../components/gift-full-preferences/full-preferences-model.js";
import { clearAccessToken } from "../auth/token-store.js";

const page = document.querySelector("gift-full-preferences");

function failure(error, message) {
  if (error.status === 401) {
    clearAccessToken();
    window.location.replace("/");
  } else {
    page.error = message;
  }
}

async function load() {
  page.loading = true;
  page.error = "";
  page.loadFailed = false;
  try {
    page.values = readPreferences(await loadPreferences());
  } catch (error) {
    page.loadFailed = true;
    failure(error, "Check your connection and retry loading before editing.");
  } finally {
    page.loading = false;
  }
}

page.addEventListener("preferences-reload", load);
page.addEventListener("preferences-save", async event => {
  if (page.blocked) return;
  page.saving = true;
  page.error = "";
  page.message = "";
  try {
    await savePreferences(event.detail);
    page.message = "Preferences saved";
  } catch (error) {
    failure(error, "Some preferences may not have saved. Your changes are still here; try saving again.");
  } finally {
    page.saving = false;
  }
});
load();
