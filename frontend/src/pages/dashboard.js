import "../app/boot-authed.js";
import { LitElement, html } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import { apiFetch } from "../api/client.js";
import "../components/gift-dashboard/gift-dashboard.js";
import "../components/shared/gift-modal/gift-modal.js";
import { getAccessToken, clearAccessToken } from "../auth/token-store.js";

const dashboard = document.querySelector("gift-dashboard");
const addGiftModal = document.getElementById("add-gift-modal");

async function loadData() {
  dashboard.loading = true;
  dashboard.error = "";

  try {
    const userData = await apiFetch("/user/1", { token: getAccessToken() });
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
dashboard.addEventListener("dashboard-reload", loadData);

if (getAccessToken()) {
  loadData();
}