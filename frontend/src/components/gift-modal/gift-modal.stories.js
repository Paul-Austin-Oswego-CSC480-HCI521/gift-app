import { html } from "lit";
import "./gift-modal.js";

// One story per modal type; `type` selects which modal gift-modal renders. Add a story here
// whenever a new type is added to MODALS in gift-modal.js.
export default {
  title: "Custom Components/Modal",
  component: "gift-modal",
  parameters: {
    layout: "fullscreen",
  },
};

// Carbon's cds-radio-button renders aria-readonly="false" on its inner <input type="radio">
// (radio-button.js in @carbon/web-components), which axe's aria-allowed-attr rule rejects.
// It is Carbon's own markup, always "false" here, and can't be changed from outside the shadow
// root, so only that rule is disabled, only on stories that contain the radio group.
const carbonRadioAriaReadonly = {
  a11y: { config: { rules: [{ id: "aria-allowed-attr", enabled: false }] } },
};

export const Default = {
  render: () => html`<gift-modal type="add-gift" open></gift-modal>`,
  parameters: carbonRadioAriaReadonly,
};
