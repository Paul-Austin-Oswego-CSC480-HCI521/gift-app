import "@carbon/web-components/es/components/link/index.js";
import { html } from "lit";

export default {
  title: "Carbon Components/Link",
  render: ({ label, disabled }) =>
    html`<cds-link href="#" ?disabled=${disabled}>${label}</cds-link>`,
  argTypes: {
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    disabled: false,
    label: "Carbon link",
  },
};

export const Default = {};

export const Disabled = {
  args: { disabled: true },
};
