
import { describe, it, expect, afterEach } from "vitest";
import "./gift-people-profile.js";

let profile;

afterEach(() => {
  profile?.remove();
  profile = null;
});

async function createProfile(person = null) {
  profile = document.createElement("gift-people-profile");
  profile.person = person;
  profile.loading = false;
  document.body.appendChild(profile);
  await profile.updateComplete;
  return profile;
}

describe("gift-people-profile", () => {
  it("registers the component", () => {
    expect(customElements.get("gift-people-profile")).toBeDefined();
  });

  it("displays the person's name", async () => {
    const el = await createProfile({
      fullName: "Vanessa Maike",
      attributes: [],
      gifts: [],
    });
    expect(el.shadowRoot.querySelector("h1").textContent)
      .toContain("Vanessa Maike");
  });

  it("shows loading state", async () => {
    const el = await createProfile();
    el.loading = true;
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("Loading person profile");
  });

  it("shows an error message", async () => {
    const el = await createProfile();
    el.error = "Person not found";
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("Person not found");
  });

  it("passes gifts to the wishlist table", async () => {
    const el = await createProfile({
      fullName: "Vanessa Maike",
      attributes: [],
      gifts: [{ id: 1, name: "Headphones" }],
    });
    const table = el.shadowRoot.querySelector("gift-wishlist-table");
    expect(table.items).toHaveLength(1);
    expect(table.items[0].giftName).toBe("Headphones");
  });

  it("handles missing preferences", async () => {
    const el = await createProfile({
      fullName: "Vanessa Maike",
      attributes: [],
      gifts: [],
    });
    expect(el.shadowRoot.textContent).toContain("Not provided");
  });
});
