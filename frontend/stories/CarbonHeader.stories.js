import { html } from "lit";
import "../src/components/nav-header.js";

// Demonstrates the standard <cds-header> configuration used by the HTML page.
// Swap in real routes for the `href`s once routing exists.
export default {
  title: "Example/Carbon Header",
  render: ({ productName }) => html`
    <gift-nav-header product-name=${productName}>
      <cds-header-nav menu-bar-label="Gift App navigation">
        <cds-header-nav-item href="/" is-active>Gift App</cds-header-nav-item>
        <cds-header-nav-item href="/gifts">Gifts</cds-header-nav-item>
        <cds-header-nav-item href="/people">People</cds-header-nav-item>
      </cds-header-nav>
    </gift-nav-header>
  `,
  argTypes: {
    productName: { control: "text" },
  },
  args: {
    productName: "Gift App",
  },
};

export const Default = {};

