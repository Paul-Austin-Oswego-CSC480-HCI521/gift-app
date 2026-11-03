import { afterEach, describe, expect, it, vi } from "vitest";
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

    expect(rows).toHaveLength(5);
    expect(text(rows[0])).toContain("5 DAYS Mom Birthday Mon, Oct 19, 2026");
    expect(text(rows[1])).toContain("10 DAYS Alex Rivera Anniversary Sat, Oct 24, 2026");
  });

  it("renders purchased and not-purchased summaries from row status", async () => {
    const table = await renderTable(upcomingDates);
    const rows = [...table.shadowRoot.querySelectorAll("cds-table-row")];

    expect(text(rows[0])).toContain("2 gifts to buy");
    expect(text(rows[0])).not.toContain("Purchased on");
    expect(rows[0].querySelector("cds-tag")).toHaveAttribute("type", "red");
    expect(text(rows[1])).toContain("All gifts purchased");
    expect(text(rows[1])).toContain("Purchased on Sat, Oct 10, 2026");
    expect(rows[1].querySelector("cds-tag")).toHaveAttribute("type", "green");
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

  it("emits date-edit with the row id when the edit button is pressed", async () => {
    const table = await renderTable(upcomingDates);
    const onEdit = vi.fn();
    table.addEventListener("date-edit", onEdit);

    table.shadowRoot.querySelector("cds-icon-button").click();

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit.mock.calls[0][0].detail).toEqual({ id: "mom-birthday" });
  });

  it("draws occasion pictograms at 32px and falls back to the calendar", async () => {
    const table = await renderTable([
      upcomingDates[0],
      { ...upcomingDates[0], id: "x", occasion: { name: "Graduation", dateLabel: "", category: "other" } },
    ]);
    const icons = [...table.shadowRoot.querySelectorAll(".occasion-cell svg.occasion-icon")];

    expect(icons).toHaveLength(2);
    for (const icon of icons) {
      expect(icon).toHaveAttribute("width", "32");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
    expect(icons[0].innerHTML).not.toBe(icons[1].innerHTML);
  });

  it("does not use zebra striping for status", async () => {
    const table = await renderTable(upcomingDates);

    expect(table.shadowRoot.querySelector("cds-table")).not.toHaveAttribute("use-zebra-styles");
  });
});
