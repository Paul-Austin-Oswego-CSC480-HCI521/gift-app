import "@carbon/web-components/es/components/text-input/index.js";
import { html } from "lit";

export default {
  title: "Carbon Components/Text Input",
  render: ({ label, placeholder, disabled }) =>
    html`<cds-text-input label=${label} placeholder=${placeholder} ?disabled=${disabled}></cds-text-input>`,
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Lorem ipsum",
    placeholder: "Dolor sit amet",
    disabled: false,
  },
};

export const Default = {};

export const Disabled = {
  args: { disabled: true },
};
