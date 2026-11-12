// People page: loads the signed-in user's people into <gift-people> and saves new ones.
import "../app/boot-authed.js";
import { apiFetch } from "../api/client.js";
import "../components/gift-people/gift-people.js";
import {
  getAccessToken,
  getUserId,
  clearAccessToken,
} from "../auth/token-store.js";

const peoplePage = document.querySelector("gift-people");

async function loadPeople() {
  peoplePage.loading = true;
  peoplePage.error = "";

  try {
    const data = await apiFetch(
      `/user/${getUserId()}/person`,
      { token: getAccessToken() }
    );

    peoplePage.people = data;
  } catch (error) {
    if (error.status === 401) {
      clearAccessToken();
      window.location.replace("/");
      return;
    }

    peoplePage.error = error.message;
  } finally {
    peoplePage.loading = false;
  }
}

async function addPerson(event) {
  const { firstName, lastName } = event.detail;

  try {
    await apiFetch(
      `/user/${getUserId()}/person`,
      {
        method: "POST",
        token: getAccessToken(),
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
        }),
      }
    );

    await loadPeople();
  } catch (error) {
    if (error.status === 401) {
      clearAccessToken();
      window.location.replace("/");
      return;
    }

    peoplePage.error = error.message;
  }
}

peoplePage.addEventListener("add-person", addPerson);
peoplePage.addEventListener("people-reload", loadPeople);

function openFormIfRequested() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("add") !== "1") return;

  peoplePage.openForm();

  // Remove the param so a refresh doesn't reopen the form.
  params.delete("add");
  const query = params.toString();
  history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
}

if (getAccessToken() && getUserId()) {
  loadPeople().then(openFormIfRequested);
}
