import "@carbon/web-components/es/components/button/index.js";
import { html } from "lit";

export default {
  title: "Example/Carbon Button",
  render: ({ kind, disabled, label }) =>
    html`<cds-button kind=${kind} ?disabled=${disabled}>${label}</cds-button>`,
  argTypes: {
    kind: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "danger", "ghost"],
    },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    kind: "primary",
    disabled: false,
    label: "Hello, Carbon",
  },
};

export const Primary = {};

export const Secondary = {
  args: { kind: "secondary" },
};

export const Disabled = {
  args: { disabled: true },
};
