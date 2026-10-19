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

export const Default = {
  render: () => html`<gift-modal type="add-gift" open></gift-modal>`,
};
