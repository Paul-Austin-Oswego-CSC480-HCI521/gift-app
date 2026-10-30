import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/link/index.js";
import "../../styles/brand-theme.css";
import "../../styles/carbon-shape-overrides.js";
import "../../styles/carbon-font-overrides.js";

export class DashboardCard extends LitElement {
  static properties = {
    heading: { type: String },
    description: { type: String },
    addLabel: { type: String, attribute: "add-label" },
    total: { type: Number },
    viewAllHref: { type: String, attribute: "view-all-href" },
    disabled: { type: Boolean },
  };

  static styles = css`
    .card {
      background: var(--card-background, #fcfbf4);
      border-radius: var(--radius-large, 0.75rem);
      box-shadow: 4px 4px 0 var(--shadow-accent, #8b1a1a);
      padding: 1.25rem;
    }
    header { display: flex; gap: 1rem; align-items: flex-start; }
    .icon {
      background: var(--brand-green, #1f4d3f);
      color: #fff;
      border-radius: var(--radius-large, 0.75rem);
      padding: 0.75rem;
    }
    h2 { margin: 0; font-size: 1.25rem; font-weight: 500; }
    p { margin: 0.25rem 0 0.5rem; font-size: 0.75rem; }
    .totals {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0 0.5rem;
    }
    .count { font-size: 1.75rem; margin-right: 0.5rem; }
  `;

  _add() {
    this.dispatchEvent(new CustomEvent("add-click", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <section class="card">
        <header>
          <div class="icon"><slot name="icon"></slot></div>
          <div>
            <h2>${this.heading}</h2>
            <p>${this.description}</p>
            <cds-button size="sm" ?disabled=${this.disabled} @click=${this._add}>${this.addLabel}</cds-button>
          </div>
        </header>

        <div class="totals">
          <div><span class="count">${this.total}</span>Total</div>
          <cds-link href=${this.viewAllHref ?? "#"}>View all</cds-link>
        </div>

        <div role="list"><slot></slot></div>
      </section>
    `;
  }
}

customElements.define("dashboard-card", DashboardCard);