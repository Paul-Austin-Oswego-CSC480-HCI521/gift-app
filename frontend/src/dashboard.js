import "./auth/require-auth.js";
import { LitElement, html } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import { apiFetch } from "./api/client.js";
import "./components/gift-side-nav/gift-side-nav.js";
import "./components/gift-nav-header/gift-nav-header.js";
import "./components/gift-dashboard/gift-dashboard.js";
import "./components/gift-modal/gift-modal.js";
import "./styles/brand-theme.css";
import "./styles/carbon-shape-overrides.js";
import "./styles/carbon-font-overrides.js";
import { getAccessToken, clearAccessToken } from "./auth/token-store.js";

const dashboard = document.querySelector("gift-dashboard");
const addGiftModal = document.getElementById("add-gift-modal");

async function loadData() {
  dashboard.loading = true;
  dashboard.error = "";

  try {
    dashboard.user = await apiFetch("/user/1", { token: getAccessToken() });
  } catch (error) {
    if (error.status === 401) {
      clearAccessToken();
      window.location.replace("./index.html");
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