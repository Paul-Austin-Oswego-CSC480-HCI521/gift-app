import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import Logout20 from "@carbon/icons/es/logout/20.js";
import { getAccessToken, clearAccessToken } from "../../../auth/token-store.js";

// Shared cds-header shell. Navigation markup is supplied by the page through the default
// slot, keeping page composition in HTML instead of a JavaScript data structure.
export class NavHeader extends LitElement {
  // Maps the product-name attribute in HTML to this.productName.
  static properties = {
    productName: { type: String, attribute: "product-name" },
  };

  static styles = css`
      .actions {
        display: flex;
        align-items: center;
        margin-inline-start: auto;
        padding-inline-end: var(--cds-spacing-05, 1rem);
      }
    `;

  constructor() {
    super();
    this.productName = "Gift App";
  }

  _logout() {
    clearAccessToken();
    window.location.replace("/");
  }

  render() {
    // We use a variable for this because the header is used in login and registration page, but we
    // dont need the logout button there
    const signedIn = Boolean(getAccessToken());

    return html`
          <cds-header aria-label="${this.productName} header">
            <cds-header-name prefix=""
              >${this.productName}</cds-header-name>
            ${signedIn ? html`
                  <div class="actions">
                    <cds-button
                      type="button"
                      kind="primary"
                      size="sm"
                      @click=${this._logout}
                      >Log out</cds-button>
                  </div>`
              : nothing}
          </cds-header>
        `;
      }
    }

// This connects the HTML tag to the class above. Import this file before using the tag.
customElements.define("gift-nav-header", NavHeader);