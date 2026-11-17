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

// WCAG 1.4.3 exempts inactive (disabled) components from contrast requirements. The dark
// accessibility run (npm run test:storybook:dark) checks color-contrast, so exempt this one story.
export const Disabled = {
  args: { disabled: true },
  parameters: { a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } } },
};
