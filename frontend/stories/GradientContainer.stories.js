import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "../src/components/gradient-container.js";

// Example story for a custom (non-Carbon) web component. components/ export custom elements
// (see src/components/gradient-container.js) - import for the customElements.define() side
// effect, then use the tag directly; content is projected in via its default slot.
export default {
  title: "Example/Gradient Container",
  render: ({ content }) => html`
    <gift-gradient-container>${unsafeHTML(content)}</gift-gradient-container>
  `,
  argTypes: {
    content: { control: "text" },
  },
  args: {
    content: "<h1>Page content goes here</h1>",
  },
};

export const Default = {};

