import { LitElement, html } from "lit";
import "../gift-preferences-header/gift-preferences-header.js";
import "../gift-wishlist-table/gift-wishlist-table.js";
import { pageContentStyles } from "../../styles/page-content.js";

// My Wish List page content: title, preferences header and the wishlist table. It only renders what
// it is given; the table's `wishlist-save` event bubbles out of this element for the page script.
export class GiftMyWishlist extends LitElement {
  static properties = {
    items: { attribute: false },
    loading: { type: Boolean },
    saving: { type: Boolean },
    error: { type: String },
    saveError: { type: String },
  };

  static styles = pageContentStyles;

  constructor() {
    super();
    this.items = [];
    this.loading = false;
    this.saving = false;
    this.error = "";
    this.saveError = "";
  }

  closeEditor() {
    this.renderRoot.querySelector("gift-wishlist-table")?.closeEditor();
  }

  render() {
    return html`
      <h1>My Wish List</h1>
      <gift-preferences-header></gift-preferences-header>
      <gift-wishlist-table
        .items=${this.items}
        ?loading=${this.loading}
        ?saving=${this.saving}
        .error=${this.error}
        .saveError=${this.saveError}
      ></gift-wishlist-table>
    `;
  }
}

customElements.define("gift-my-wishlist", GiftMyWishlist);
