import { html } from "lit";
import "./gift-add-gift-modal.js";

export default {
  title: "Custom Components/Add Gift Modal",
  component: "gift-add-gift-modal",
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = {
  render: () => html`
    <gift-add-gift-modal open></gift-add-gift-modal>
  `,
};