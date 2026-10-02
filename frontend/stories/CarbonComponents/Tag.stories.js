import "@carbon/web-components/es/components/tag/index.js";
import { html } from "lit";

// Used as the status chip in the Gift checklist section of Layouts/Page Template - Carbon
// has no dedicated "status chip" component, so cds-tag's color types stand in for
// pending/active/info/neutral states there.
export default {
  title: "Carbon Components/Tag",
  render: ({ type, label }) => html`<cds-tag type=${type}>${label}</cds-tag>`,
  argTypes: {
    type: {
      control: "select",
      options: [
        "red",
        "magenta",
        "purple",
        "blue",
        "cyan",
        "teal",
        "green",
        "gray",
        "cool-gray",
        "warm-gray",
      ],
    },
    label: { control: "text" },
  },
  args: {
    type: "gray",
    label: "Pending lorem",
  },
};

export const Default = {};

export const StatusVariants = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <cds-tag type="gray">Pending lorem</cds-tag>
      <cds-tag type="green">Active lorem</cds-tag>
      <cds-tag type="cyan">Info lorem</cds-tag>
      <cds-tag type="cool-gray">Neutral lorem</cds-tag>
    </div>
  `,
};
