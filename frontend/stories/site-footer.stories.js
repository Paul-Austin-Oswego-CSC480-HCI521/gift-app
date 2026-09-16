import { html } from "lit";
// Import the component so customElements.define() registers <gift-site-footer>
import "../src/components/site-footer.js";

export default {
  title: "Components/Site Footer",
  render: () => html`<gift-site-footer></gift-site-footer>`,
};

export const Default = {};