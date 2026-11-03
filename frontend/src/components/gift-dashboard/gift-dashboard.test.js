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
          occasion: { name: "Birthday", date: "2099-11-14" },
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

const cards = (dashboard) => [...dashboard.shadowRoot.querySelectorAll("dashboard-card")];
const rowHeadings = (card) =>
  [...card.querySelectorAll("dashboard-row")].map((row) => row.getAttribute("heading"));

describe("gift-dashboard", () => {

  it("shows an info notification when the user has no people", async () => {
    const dashboard = await renderDashboard({ user: { fullName: "Test User 1", people: [] } });
    const note = dashboard.shadowRoot.querySelector("cds-inline-notification");
    expect(note).toHaveAttribute("kind", "info");
    expect(note).toHaveAttribute("title", "No people found");
  });

  it("shows an error notification with the message", async () => {
    const dashboard = await renderDashboard({ error: "API request to /user/1 failed: 500" });
    const note = dashboard.shadowRoot.querySelector("cds-inline-notification");
    expect(note).toHaveAttribute("kind", "error");
    expect(note).toHaveAttribute("subtitle", "API request to /user/1 failed: 500");
  });

  it("uses Carbon components instead of raw controls", async () => {
    const dashboard = await renderDashboard({ user });
    expect(dashboard.shadowRoot.querySelectorAll("button, a, table, ul, input")).toHaveLength(0);
  });

  it("shows a welcome heading and the three cards with their totals", async () => {
    const dashboard = await renderDashboard({ user });
    expect(dashboard.shadowRoot.querySelector("h1").textContent).toBe("Welcome!");
    const list = cards(dashboard);
    expect(list.map((c) => c.getAttribute("heading"))).toEqual([
      "People",
      "Gifts to Buy",
      "Upcoming Dates",
    ]);
    expect(list.map((c) => c.total)).toEqual([2, 1, 1]);
  });

  it("lists people, gifts to buy and upcoming dates as rows", async () => {
    const [people, gifts, dates] = cards(await renderDashboard({ user }));
    expect(rowHeadings(people)).toEqual(["Alex Rivera", "Sam Patel"]);
    expect(rowHeadings(gifts)).toEqual(["Coffee set"]);
    expect(gifts.querySelector("dashboard-row")).toHaveAttribute("subtitle", "November 14th, 2099");
    expect(rowHeadings(dates)).toEqual(["Birthday"]);
  });

  it("leaves purchased gifts out of Gifts to Buy", async () => {
    const dashboard = await renderDashboard({
      user: {
        people: [
          {
            fullName: "Alex",
            gifts: [
              { name: "Book", status: { stage: "purchased" } },
              { name: "Mug", status: { stage: "updated" } },
            ],
          },
        ],
      },
    });
    const gifts = cards(dashboard)[1];
    expect(gifts.total).toBe(1);
    expect(rowHeadings(gifts)).toEqual(["Mug"]);
  });

  it("lists each upcoming date once, soonest first, and skips past dates", async () => {
    const gift = (name, occasion) => ({ name, status: { stage: "updated" }, occasion });
    const dashboard = await renderDashboard({
      user: {
        people: [
          {
            fullName: "Alex",
            gifts: [
              gift("A", { name: "Later", date: "2099-12-25" }),
              gift("B", { name: "Sooner", date: "2099-01-05" }),
              gift("C", { name: "Sooner", date: "2099-01-05" }),
              gift("D", { name: "Old", date: "2000-01-01" }),
            ],
          },
        ],
      },
    });
    const dates = cards(dashboard)[2];
    expect(rowHeadings(dates)).toEqual(["Sooner", "Later"]);
    expect(dates.total).toBe(2);
  });

  it("disables the Add buttons while loading", async () => {
    const dashboard = await renderDashboard({ loading: true });
    expect(dashboard.shadowRoot.querySelector("cds-inline-loading")).toHaveAttribute(
      "assistive-text",
      "Loading people and gifts"
    );
    expect(cards(dashboard).every((c) => c.disabled)).toBe(true);
  });

  it("emits add-person, add-gift and add-date when a card's Add button fires", async () => {
    const dashboard = await renderDashboard({ user });
    const handlers = {
      "add-person": vi.fn(),
      "add-gift": vi.fn(),
      "add-date": vi.fn(),
    };
    for (const [name, fn] of Object.entries(handlers)) {
      document.body.addEventListener(name, fn);
    }
    cards(dashboard).forEach((card) =>
      card.dispatchEvent(new CustomEvent("add-click", { bubbles: true, composed: true }))
    );
    for (const fn of Object.values(handlers)) expect(fn).toHaveBeenCalledTimes(1);
  });
});
