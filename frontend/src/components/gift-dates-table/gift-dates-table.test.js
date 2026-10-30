import { afterEach, describe, expect, it } from "vitest";
import { upcomingDates } from "../../mocks/upcoming-dates.js";
import "./gift-dates-table.js";

afterEach(() => {
  document.body.replaceChildren();
});

async function renderTable(dates = []) {
  const table = document.createElement("gift-dates-table");
  table.dates = dates;
  document.body.append(table);
  await table.updateComplete;
  return table;
}

const text = (element) => element.textContent.replace(/\s+/g, " ").trim();

describe("gift-dates-table", () => {
  it("renders no rows by default", async () => {
    const table = await renderTable();

    expect(table.shadowRoot.querySelectorAll("cds-table-row")).toHaveLength(0);
  });

  it("renders each supplied date instead of owning row data", async () => {
    const table = await renderTable(upcomingDates);
    const rows = [...table.shadowRoot.querySelectorAll("cds-table-row")];

    expect(rows).toHaveLength(2);
    expect(text(rows[0])).toContain("5 DAYS Mom Birthday Mon, Oct 19, 2026");
    expect(text(rows[1])).toContain("18 DAYS Jordan Anniversary Sun, Nov 1, 2026");
  });

  it("renders purchased and not-purchased summaries from row status", async () => {
    const table = await renderTable(upcomingDates);
    const rows = [...table.shadowRoot.querySelectorAll("cds-table-row")];

    expect(text(rows[0])).toContain("All gifts purchased");
    expect(text(rows[0])).toContain("Purchased on Fri, Oct 9, 2026");
    expect(rows[0].querySelector("cds-tag")).toHaveAttribute("type", "green");
    expect(text(rows[1])).toContain("2 gifts to buy");
    expect(text(rows[1])).not.toContain("Purchased on");
    expect(rows[1].querySelector("cds-tag")).toHaveAttribute("type", "red");
  });

  it("uses specific accessible labels for occasion and edit controls", async () => {
    const table = await renderTable(upcomingDates);
    const firstRow = table.shadowRoot.querySelector("cds-table-row");

    expect(firstRow.querySelector('cds-table-cell[aria-label="Birthday"]')).toBeInTheDocument();
    expect(firstRow.querySelector('[slot="tooltip-content"]')).toHaveTextContent(
      "Edit Mom's birthday"
    );
  });

  it("keeps the table headers available while visually hiding them", async () => {
    const table = await renderTable(upcomingDates);
    const head = table.shadowRoot.querySelector("cds-table-head");
    const headers = [...head.querySelectorAll("cds-table-header-cell")].map(text);

    expect(head).toHaveClass("visually-hidden");
    expect(headers).toEqual(["Days", "Occasion", "Details", "Status", "Actions"]);
  });

  it("does not use zebra striping for status", async () => {
    const table = await renderTable(upcomingDates);

    expect(table.shadowRoot.querySelector("cds-table")).not.toHaveAttribute("use-zebra-styles");
  });
});
