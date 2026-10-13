import "@carbon/web-components/es/components/checkbox/index.js";
import { html } from "lit";

export default {
  title: "Carbon Components/Checkbox",
  render: ({ labelText, checked, disabled }) =>
    html`<cds-checkbox label-text=${labelText} ?checked=${checked} ?disabled=${disabled}></cds-checkbox>`,
  argTypes: {
    labelText: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    labelText: "Lorem ipsum dolor sit amet",
    checked: false,
    disabled: false,
  },
};

export const Default = {};

export const Checked = {
  args: { checked: true },
};

export const Disabled = {
  args: { disabled: true },
};
