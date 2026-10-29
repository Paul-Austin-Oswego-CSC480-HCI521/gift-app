import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/checkbox/index.js";
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

  static styles = css`
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-top: 1px solid currentColor;
    }
    .title { display: block; font-size: 1rem; }
    .sub { display: block; font-size: 0.7rem; }
    button { background: none; border: 0; cursor: pointer; }
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
          : html`<button aria-label="Open ${this.heading}" @click=${this._select}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M18 6l-1.4 1.4L24.2 15H4v2h20.2l-7.6 7.6L18 26l10-10z"></path>
              </svg>
            </button>`}
      </div>
    `;
  }
}

customElements.define("dashboard-row", DashboardRow);