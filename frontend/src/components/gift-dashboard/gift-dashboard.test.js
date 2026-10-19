import { afterEach, describe, expect, it, vi } from "vitest";
import "./gift-dashboard.js";

afterEach(() => {
  document.body.replaceChildren();
});

const user = {
  fullName: "Test User 1",
  people: [
    {
      fullName: "Alex Rivera",
      gifts: [
        {
          name: "Coffee set",
          type: "Physical",
          status: { stage: "Need to buy" },
          occasion: { name: "Birthday", date: "2026-11-14" },
          purchaseDate: null,
        },
      ],
    },
    { fullName: "Sam Patel", gifts: [] },
  ],
};

async function renderDashboard(props = {}) {
  const dashboard = document.createElement("gift-dashboard");
  Object.assign(dashboard, props);
  document.body.append(dashboard);
  await dashboard.updateComplete;
  return dashboard;
}

const text = (element) => element.textContent.replace(/\s+/g, " ").trim();

describe("gift-dashboard", () => {
  it("headlines with the user's name and renders a tile per person", async () => {
    const dashboard = await renderDashboard({ user });
    const root = dashboard.shadowRoot;
    expect(root.querySelector("h1").textContent).toBe("Test User 1's people and gifts");
    const tiles = [...root.querySelectorAll("cds-tile")];
    expect(tiles.map((tile) => tile.querySelector("h2").textContent)).toEqual([
      "Alex Rivera",
      "Sam Patel",
    ]);
  });

  it("lists a gift's details, with a tag for the status and a dash for missing values", async () => {
    const dashboard = await renderDashboard({ user });
    const row = dashboard.shadowRoot.querySelector("cds-structured-list-row");
    const cells = [...row.querySelectorAll("cds-structured-list-cell")].map(text);
    expect(cells).toEqual(["Coffee set", "Physical", "Need to buy", "Birthday", "2026-11-14", "—"]);
    expect(row.querySelector("cds-tag")).toHaveTextContent("Need to buy");
    expect(dashboard.shadowRoot.querySelector("cds-structured-list")).toHaveAttribute(
      "aria-label",
      "Gifts for Alex Rivera"
    );
  });

  it("says when a person has no gifts", async () => {
    const dashboard = await renderDashboard({ user });
    const tiles = dashboard.shadowRoot.querySelectorAll("cds-tile");
    expect(tiles[1]).toHaveTextContent("No gifts yet.");
    expect(tiles[1].querySelector("cds-structured-list")).toBeNull();
  });

  it("shows an info notification when the user has no people", async () => {
    const dashboard = await renderDashboard({ user: { fullName: "Test User 1", people: [] } });
    const note = dashboard.shadowRoot.querySelector("cds-inline-notification");
    expect(note).toHaveAttribute("kind", "info");
    expect(note).toHaveAttribute("title", "No people found");
  });

  it("shows loading status and disables the buttons while loading", async () => {
    const dashboard = await renderDashboard({ loading: true });
    const root = dashboard.shadowRoot;
    expect(root.querySelector("cds-inline-loading")).toHaveAttribute(
      "assistive-text",
      "Loading people and gifts"
    );
    expect([...root.querySelectorAll("cds-button")].every((button) => button.disabled)).toBe(true);
  });

  it("shows an error notification with the message", async () => {
    const dashboard = await renderDashboard({ error: "API request to /user/1 failed: 500" });
    const note = dashboard.shadowRoot.querySelector("cds-inline-notification");
    expect(note).toHaveAttribute("kind", "error");
    expect(note).toHaveAttribute("subtitle", "API request to /user/1 failed: 500");
  });

  it("emits add-gift and dashboard-reload from the labelled buttons", async () => {
    const dashboard = await renderDashboard({ user });
    const addGift = vi.fn();
    const reload = vi.fn();
    document.body.addEventListener("add-gift", addGift);
    document.body.addEventListener("dashboard-reload", reload);
    const buttons = [...dashboard.shadowRoot.querySelectorAll("cds-button")];
    expect(buttons.map(text)).toEqual(["Add Gift", "Reload data"]);
    buttons[0].click();
    buttons[1].click();
    expect(addGift).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("uses Carbon components instead of raw controls", async () => {
    const dashboard = await renderDashboard({ user });
    expect(dashboard.shadowRoot.querySelectorAll("button, a, table, ul, input")).toHaveLength(0);
  });
});
