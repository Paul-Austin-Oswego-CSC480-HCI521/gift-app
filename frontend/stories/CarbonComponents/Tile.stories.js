import "@carbon/web-components/es/components/tile/index.js";
import { html } from "lit";

export default {
  title: "Carbon Components/Tile",
  render: ({ label, value }) => html`
    <cds-tile style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 10rem;">
      <span style="font-size: 0.75rem; color: var(--cds-text-secondary);">${label}</span>
      <span style="font-size: 1.5rem; font-weight: 600;">${value}</span>
    </cds-tile>
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
