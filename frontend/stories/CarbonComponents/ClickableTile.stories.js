import "@carbon/web-components/es/components/tile/clickable-tile.js";
import { html } from "lit";

export default {
  title: "Carbon Components/Clickable Tile",
  render: ({ label, value }) => html`
    <cds-clickable-tile href="#" link-role="link">
      <div style="display: flex; flex-direction: column; gap: var(--cds-spacing-02); min-width: 10rem;">
        <span style="color: var(--cds-text-secondary);">${label}</span>
        <span>${value}</span>
      </div>
    </cds-clickable-tile>
  `,
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
  },
  args: {
    label: "Lorem ipsum",
    value: "2",
  },
};

export const Default = {};
