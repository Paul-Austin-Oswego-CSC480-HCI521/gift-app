import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/pagination/index.js";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";

// Data table (Gifts frame, node 1287:10113): --cds-layer-01 body, --cds-layer-accent-01
// header, 64px rows (size="xl"), secondary-colour cells and an expand chevron per row.
// The Figma header instance is 64px tall, the same as a row, so the header follows xl too.
const COLUMNS = ["Gift", "Recipient", "Status", "Date Needed"];
// cds-table-row renders its expand button in its shadow root with no accessible name and no
// way to set one, so label it after each render, including after the row toggles.
const labelExpandButton = (row) => {
  if (!row) return;
  const apply = async () => {
    await row.updateComplete;
    const button = row.shadowRoot.querySelector(".cds--table-expand__button");
    if (!button) return;
    button.setAttribute("aria-label", row.expanded ? "Collapse row" : "Expand row");
    button.setAttribute("aria-expanded", String(Boolean(row.expanded)));
  };
  apply();
  row.addEventListener("click", apply);
};
const ROWS = Array.from({ length: 5 }, () => ["Content", "Content", "Content", "Content"]);

export default {
  title: "Carbon Components/Data Table",
  render: ({ size, expandable }) => html`
    <cds-table size=${size} ?expandable=${expandable}>
      <cds-table-head>
        <cds-table-header-row>
          ${COLUMNS.map((c) => html`<cds-table-header-cell>${c}</cds-table-header-cell>`)}
        </cds-table-header-row>
      </cds-table-head>
      <cds-table-body>
        ${ROWS.map(
          (cells) => html`
            <cds-table-row ?expandable=${expandable} ${ref(labelExpandButton)}>
              ${cells.map((c) => html`<cds-table-cell>${c}</cds-table-cell>`)}
            </cds-table-row>
            ${expandable
              ? html`<cds-table-expanded-row>Gift details</cds-table-expanded-row>`
              : ""}
          `
        )}
      </cds-table-body>
    </cds-table>
    <cds-pagination page-size="100" start="0" total-items="100" items-per-page-text="Items per page:">
      <cds-select-item value="10">10</cds-select-item>
      <cds-select-item value="100">100</cds-select-item>
    </cds-pagination>
  `,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    expandable: { control: "boolean" },
  },
  args: { size: "xl", expandable: true },
};

export const Default = {};
