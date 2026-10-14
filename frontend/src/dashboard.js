import { apiFetch } from "./api/client.js";

const heading = document.querySelector("#page-heading");
const status = document.querySelector("#status");
const peopleList = document.querySelector("#people-list");
const reloadButton = document.querySelector("#reload-button");

function makeElement(tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

async function loadData() {
  reloadButton.disabled = true;
  status.textContent = "Loading…";
  peopleList.replaceChildren();

  try {
    const user = await apiFetch("/user/1");

    heading.textContent = `${user.fullName}'s people and gifts`;

    const people = user.people ?? [];

    for (const person of people) {
      const card = document.createElement("section");
      card.className = "person-card";
      card.append(makeElement("h2", person.fullName));

      const gifts = person.gifts ?? [];

      if (gifts.length === 0) {
        card.append(makeElement("p", "No gifts yet."));
      } else {
        const list = document.createElement("ul");

        for (const gift of gifts) {
          const item = document.createElement("li");

          item.append(
            makeElement("strong", gift.name),
            makeElement("div", `Type: ${gift.type ?? "—"}`),
            makeElement(
              "div",
              `Status: ${gift.status?.stage ?? "—"}`
            ),
            makeElement(
              "div",
              `Occasion: ${gift.occasion?.name ?? "—"}`
            ),
            makeElement(
              "div",
              `Occasion date: ${gift.occasion?.date ?? "—"}`
            ),
            makeElement(
              "div",
              `Purchase date: ${gift.purchaseDate ?? "—"}`
            )
          );

          list.append(item);
        }

        card.append(list);
      }

      peopleList.append(card);
    }

    status.textContent = people.length
      ? "Data loaded successfully."
      : "No people found.";
  } catch (error) {
    status.textContent = `Could not load data: ${error.message}`;
  } finally {
    reloadButton.disabled = false;
  }
}

reloadButton.addEventListener("click", loadData);
loadData();