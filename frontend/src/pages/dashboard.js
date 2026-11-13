import "../app/boot-authed.js";
import { apiFetch } from "../api/client.js";
import "../components/gift-dashboard/gift-dashboard.js";
import "../components/shared/gift-modal/gift-modal.js";
import { getAccessToken, getUserId, clearAccessToken } from "../auth/token-store.js";
import { routes } from "../config/routes.js";

const dashboard = document.querySelector("gift-dashboard");
const addGiftModal = document.getElementById("add-gift-modal");

async function loadData() {
  dashboard.loading = true;
  dashboard.error = "";

  try {
    const userData = await apiFetch(`/user/${getUserId()}`, { token: getAccessToken() });
    dashboard.user = userData;

    addGiftModal.people = userData.people ?? [];
  } catch (error) {
    if (error.status === 401) {
      clearAccessToken();
      window.location.replace("/");
      return;
    }
    dashboard.user = null;
    dashboard.error = error.message;
  } finally {
    dashboard.loading = false;
  }
}

dashboard.addEventListener("add-gift", () => {
  addGiftModal.open = true;
});
dashboard.addEventListener("add-person", () => {
  window.location.assign(routes.people.path);
});
dashboard.addEventListener("add-date", () => {
  window.location.assign(routes.dates.path);
});
dashboard.addEventListener("dashboard-reload", loadData);
addGiftModal.addEventListener("gift-added", loadData);

if (getAccessToken() && getUserId()) {
  loadData();
}