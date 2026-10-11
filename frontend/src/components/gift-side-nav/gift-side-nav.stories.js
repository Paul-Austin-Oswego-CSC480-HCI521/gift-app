import { html } from "lit";
import "./gift-side-nav.js";

export default {
  title: "Example/Side Navigation",
  render: () => html`<gift-side-nav></gift-side-nav>`,
};
export const Default = {};
// A shorter host still keeps every control available without clipping.
export const ShortContainer = {
  render: () => html`<gift-side-nav style="--gift-side-nav-height: 30rem"></gift-side-nav>`,
};
