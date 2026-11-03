// Upcoming Dates page: loads the signed-in user's people into <gift-upcoming-dates> as date rows.
import "../app/boot-authed.js";
import { apiFetch } from "../api/client.js";
import "../components/gift-upcoming-dates/gift-upcoming-dates.js";
import { buildDateRows } from "../components/gift-upcoming-dates/upcoming-dates-model.js";
import { getAccessToken, getUserId, clearAccessToken } from "../auth/token-store.js";

const page = document.querySelector("gift-upcoming-dates");

async function loadDates() {
  page.loading = true;
  page.error = "";

  try {
    const people = await apiFetch(`/user/${getUserId()}/person`, { token: getAccessToken() });
    page.dates = buildDateRows(people);
  } catch (error) {
    if (error.status === 401) {
      clearAccessToken();
      window.location.replace("/");
      return;
    }
    page.dates = [];
    page.error = error.message;
  } finally {
    page.loading = false;
  }
}

if (getAccessToken() && getUserId()) {
  loadDates();
}
