import { afterEach, describe, expect, it } from "vitest";
import { upcomingDates } from "../../mocks/upcoming-dates.js";
import "./gift-upcoming-dates.js";

afterEach(() => {
  document.body.replaceChildren();
});

async function render(props = {}) {
  const el = document.createElement("gift-upcoming-dates");
  Object.assign(el, { dates: upcomingDates, ...props });
  document.body.append(el);
  await el.updateComplete;
  return el;
}

const tableRows = (el) => el.shadowRoot.querySelector("gift-dates-table").dates;
const search = (el, value) => {
  el.shadowRoot
    .querySelector("cds-search")
    .dispatchEvent(new CustomEvent("cds-search-input", { detail: { value }, bubbles: true, composed: true }));
  return el.updateComplete;
};

describe("gift-upcoming-dates", () => {
  it("renders the title, three metric tiles and the first page of rows", async () => {
    const el = await render();

    expect(el.shadowRoot.querySelector("h1")).toHaveTextContent("Upcoming Dates");
    expect(el.shadowRoot.querySelectorAll('gift-tile[type="metric"]')).toHaveLength(3);
    expect(tableRows(el)).toHaveLength(5);
  });

  it("derives the metric values from the dates", async () => {
    const el = await render();
    const values = [...el.shadowRoot.querySelectorAll(".metric-value")].map((v) => v.textContent);

    // 4 dates within 30 days, 2 gifts still to buy, none without gifts
    expect(values).toEqual(["4", "2", "0"]);
  });

  it("filters rows by search text and resets to the first page", async () => {
    const el = await render();
    await search(el, "lee");

    expect(tableRows(el).map((d) => d.person)).toEqual(["Lee Johnson"]);
  });

  it("shows a message instead of the table when nothing matches", async () => {
    const el = await render();
    await search(el, "zzz");

    expect(el.shadowRoot.querySelector("gift-dates-table")).toBeNull();
    expect(el.shadowRoot.querySelector("cds-inline-notification")).toHaveAttribute("title", "No matching dates");
  });

  it("pages the list when the page size is smaller than the total", async () => {
    const el = await render();
    el.shadowRoot
      .querySelector("cds-pagination")
      .dispatchEvent(
        new CustomEvent("cds-pagination-changed-current", { detail: { page: 1, pageSize: 2 }, bubbles: true })
      );
    await el.updateComplete;

    expect(tableRows(el)).toHaveLength(2);
  });

  it("shows the error and hides the list", async () => {
    const el = await render({ error: "boom" });

    expect(el.shadowRoot.querySelector("cds-inline-notification")).toHaveAttribute("subtitle", "boom");
    expect(el.shadowRoot.querySelector("gift-dates-table")).toBeNull();
  });
});
