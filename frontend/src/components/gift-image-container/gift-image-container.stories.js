import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "./gift-image-container.js";

// Example story for a custom (non-Carbon) web component. components/ export custom elements
// (see src/components/gift-image-container/gift-image-container.js) - import for the customElements.define() side
// effect, then use the tag directly; content is projected in via its default slot.
export default {
  title: "Custom Components/Image Container",
  render: ({ content }) => html`
    <gift-image-container>${unsafeHTML(content)}</gift-image-container>
  `,
  argTypes: {
    content: { control: "text" },
  },
  args: {
    content: "<h1>Page content goes here</h1>",
  },
};

export const Default = {};
