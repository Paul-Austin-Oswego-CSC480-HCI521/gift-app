import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/link/index.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import Add16 from "@carbon/icons/es/add/16.js";
import ArrowRight16 from "@carbon/icons/es/arrow--right/16.js";
import "../gift-tile/gift-tile.js";

// Figma "Gift Card / Section" (5:4470): a gift-tile of type "section" holding a header (icon, title,
// description, add button), a summary (total + View all) and a list. The tile supplies the card
// surface, radius and offset shadow; this component only lays out the section content.
export class DashboardCard extends LitElement {
  static properties = {
    heading: { type: String },
    description: { type: String },
    addLabel: { type: String, attribute: "add-label" },
    total: { type: Number },
    viewAllHref: { type: String, attribute: "view-all-href" },
    // Visually hidden text after "View all" so the link name is unique, e.g. "People".
    viewAllLabel: { type: String, attribute: "view-all-label" },
    disabled: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    /* Dashboard cards fill their grid column; the tile caps itself at the Figma 308px width. */
    gift-tile {
      max-inline-size: none;
    }

    header {
      display: flex;
      gap: var(--cds-spacing-06, 1.5rem);
      align-items: center;
    }

    .icon {
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;
      inline-size: 3.625rem; /* Figma: 58 x 49 */
      block-size: 3.0625rem;
      border-radius: var(--tile-radius);
      background: var(--cds-button-primary);
      color: var(--cds-text-on-color);
    }

    .heading {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-03, 0.5rem);
      align-items: flex-start;
      min-inline-size: 0;
    }

    h2 {
      margin: 0;
      font-family: var(--font-family-heading);
      font-size: 1.625rem;
      font-weight: 400;
      line-height: normal;
      color: var(--cds-text-primary);
    }

    p {
      margin: 0;
      font-size: 0.9375rem;
      color: var(--cds-text-primary);
    }

    .summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-block: var(--cds-spacing-05, 1rem);
    }

    .total {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.9375rem;
      color: var(--cds-text-primary);
    }

    .count {
      font-family: var(--font-family-heading);
      font-size: 2rem;
      line-height: 1.25;
    }

    /* Carbon's .cds--visually-hidden rule, repeated because the global stylesheet cannot reach into
       this shadow root. It gives each "View all" link a unique accessible name. */
    .cds--visually-hidden {
      position: absolute;
      overflow: hidden;
      padding: 0;
      border: 0;
      margin: -1px;
      block-size: 1px;
      clip: rect(0, 0, 0, 0);
      inline-size: 1px;
      visibility: inherit;
      white-space: nowrap;
    }

    [role="list"] {
      display: block;
      inline-size: 100%;
    }
  `;

  _add() {
    this.dispatchEvent(new CustomEvent("add-click", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <gift-tile type="section">
        <header>
          <div class="icon"><slot name="icon"></slot></div>
          <div class="heading">
            <h2>${this.heading}</h2>
            <p>${this.description}</p>
            <cds-button size="sm" ?disabled=${this.disabled} @click=${this._add}>
              ${this.addLabel}${iconLoader(Add16, { slot: "icon" })}
            </cds-button>
          </div>
        </header>

        <div class="summary">
          <div class="total"><span class="count">${this.total}</span>Total</div>
          <cds-link href=${this.viewAllHref ?? "#"}>
            View all <span class="cds--visually-hidden">${this.viewAllLabel}</span>${iconLoader(ArrowRight16, { slot: "icon" })}
          </cds-link>
        </div>

        <div role="list"><slot></slot></div>
      </gift-tile>
    `;
  }
}

customElements.define("dashboard-card", DashboardCard);
