import { LitElement, html } from "lit";
import "@carbon/web-components/es/components/ui-shell/index.js";

// Shared <cds-header> shell. Navigation markup is supplied by the page through the default
// slot, keeping page composition in HTML instead of a JavaScript data structure.
export class NavHeader extends LitElement {
  // This makes product-name="..." available to the component as this.productName.
  // Lit's default attribute name lowercases the property (productname); the explicit
  // `attribute` maps it back to the kebab-case name used in HTML.
  static properties = {
    productName: { type: String, attribute: "product-name" },
  };

  constructor() {
    super();
    this.productName = "Gift App";
  }

  render() {
    return html`
      <cds-header aria-label="${this.productName} header">
        <cds-header-name href="/" prefix="">${this.productName}</cds-header-name>
        <!-- A slot is an opening where the page can supply its own HTML. -->
        <slot></slot>
      </cds-header>
    `;
  }
}

customElements.define("gift-nav-header", NavHeader);

// This connects the HTML tag to the class above. Import this file before using the tag.

