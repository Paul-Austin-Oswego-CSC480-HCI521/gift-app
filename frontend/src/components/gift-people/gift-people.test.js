import { afterEach, describe, expect, it } from "vitest";
import "./gift-people.js";

const people = [
  { firstName: "River", lastName: "Stone", fullName: "River Stone" },
  { firstName: "Ada", lastName: "Lovelace", fullName: "Ada Lovelace" },
  { firstName: "Tulsi", lastName: "Rao" },
];

afterEach(() => {
  document.body.replaceChildren();
});

async function renderPeople(props = {}) {
  const el = document.createElement("gift-people");
  Object.assign(el, { people, ...props });
  document.body.append(el);
  await el.updateComplete;
  return el;
}

const personTiles = (el) => [...el.shadowRoot.querySelectorAll("gift-tile[type='person']")];

describe("gift-people", () => {
  it("renders one person tile per person, sorted by first name, plus an add tile", async () => {
    const el = await renderPeople();

    expect(personTiles(el).map((tile) => tile.textContent.trim())).toEqual([
      "Ada Lovelace",
      "River Stone",
      "Tulsi Rao",
    ]);
    expect(el.shadowRoot.querySelector("gift-tile[type='add']")).not.toBeNull();
  });

  it("links person tiles to their profile pages", async () => {
    const el = await renderPeople();
    for (const tile of personTiles(el)) {
      const href = tile.getAttribute("href");
      expect(href).toMatch(/^\/gift-people-profile\?personId=/);
    }
  });

  it("filters by search text", async () => {
    const el = await renderPeople({ search: "riv" });
    expect(personTiles(el).map((tile) => tile.textContent.trim())).toEqual(["River Stone"]);
  });

  it("shows an empty message with no people, and a no-match message for a search", async () => {
    const el = await renderPeople({ people: [] });
    expect(el.shadowRoot.querySelector(".message")).toHaveTextContent("No people yet.");

    el.people = people;
    el.search = "zzz";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".message")).toHaveTextContent("No matching people found.");
  });

  it("shows a loading indicator instead of the grid while loading", async () => {
    const el = await renderPeople({ loading: true });
    expect(el.shadowRoot.querySelector("cds-inline-loading")).not.toBeNull();
    expect(el.shadowRoot.querySelector(".grid")).toBeNull();
  });

  it("opens the form from the add tile and emits add-person with trimmed names", async () => {
    const el = await renderPeople();
    el.shadowRoot.querySelector("gift-tile[type='add']").dispatchEvent(
      new CustomEvent("gift-tile-add", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("form")).not.toBeNull();

    el.shadowRoot.querySelector('[name="firstName"]').value = " Grace ";
    el.shadowRoot.querySelector('[name="lastName"]').value = "Hopper ";
    let detail;
    el.addEventListener("add-person", (event) => (detail = event.detail));
    el.shadowRoot.querySelector("form").requestSubmit?.() ?? el.submitPerson(new Event("submit"));

    expect(detail).toEqual({ firstName: "Grace", lastName: "Hopper" });
  });

  it("requires both names", async () => {
    const el = await renderPeople();
    el.openForm();
    await el.updateComplete;
    let emitted = false;
    el.addEventListener("add-person", () => (emitted = true));
    el.submitPerson(new Event("submit"));

    expect(emitted).toBe(false);
    expect(el.error).toBe("Please enter both first and last name.");
  });
});
