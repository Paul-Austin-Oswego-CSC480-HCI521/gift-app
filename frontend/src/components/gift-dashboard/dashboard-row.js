import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/icon-button/index.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import ArrowRight32 from "@carbon/icons/es/arrow--right/32.js";
import "../../styles/brand-theme.css";
import "../../styles/carbon-shape-overrides.js";
import "../../styles/carbon-font-overrides.js";

export class DashboardRow extends LitElement {
  static properties = {
    heading: { type: String },
    subtitle: { type: String },
    variant: { type: String },   // "link" | "checkbox"
    checked: { type: Boolean },
  };

  // Figma list item: Outfit 24 title over a 13px subtitle, black rule above, arrow or checkbox at the end.
  static styles = css`
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--cds-spacing-05, 1rem);
      padding: var(--cds-spacing-05, 1rem);
      border-block-start: 1px solid var(--cds-text-primary);
    }
    .title {
      display: block;
      font-family: var(--font-family-heading);
      font-size: 1.5rem;
      line-height: normal;
    }
    .sub {
      display: block;
      padding-inline-start: var(--cds-spacing-05, 1rem);
      font-family: var(--font-family-heading);
      font-size: 0.8125rem;
    }
  `;

  constructor() {
    super();
    this.variant = "link";
    this.checked = false;
  }

  _toggle(e) {
    this.dispatchEvent(new CustomEvent("item-toggle", {
      bubbles: true, composed: true, detail: { checked: e.detail.checked },
    }));
  }

  _select() {
    this.dispatchEvent(new CustomEvent("item-select", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="row" role="listitem">
        <div>
          <span class="title">${this.heading}</span>
          <span class="sub">${this.subtitle}</span>
        </div>
        ${this.variant === "checkbox"
          ? html`<cds-checkbox hide-label label-text="Mark ${this.heading} purchased"
              ?checked=${this.checked}
              @cds-checkbox-changed=${this._toggle}></cds-checkbox>`
          : html`<cds-icon-button kind="ghost" size="lg" align="left" @click=${this._select}>
              ${iconLoader(ArrowRight32, { slot: "icon" })}
              <span slot="tooltip-content">Open ${this.heading}</span>
            </cds-icon-button>`}
      </div>
    `;
  }
}

customElements.define("dashboard-row", DashboardRow);