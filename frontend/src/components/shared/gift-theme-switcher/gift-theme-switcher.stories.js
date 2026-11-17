import { html } from "lit";
import "./gift-theme-switcher.js";

// The Light / Dark / System control at the bottom of the side nav. A composition of Carbon's
// cds-content-switcher. Choosing an option changes the app's theme and is remembered; "System"
// follows the OS setting. In Storybook the Theme toolbar controls the story's theme instead, so
// this story only shows the control itself.
export default {
  title: "Custom Components/Theme Switcher",
  render: () => html`<div style="inline-size: 12rem;"><gift-theme-switcher></gift-theme-switcher></div>`,
};

export const Default = {};
