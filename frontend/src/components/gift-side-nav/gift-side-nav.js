import { LitElement, html, nothing } from "lit";
import "@carbon/web-components/es/components/ui-shell/index.js";
import "@carbon/web-components/es/components/button/index.js";

const links = [
  ["dashboard", "Dashboard", "M3 10 12 2l9 8M5 9v12h14V9M10 21v-7h4v7"],
  ["wishlist", "My Wish List", "M3 4h3v3H3zM3 11h3v3H3zM3 18h3v3H3zM10 5h11M10 12h11M10 19h11"],
  ["people", "People", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 22v-4a7 7 0 0 1 14 0v4M17 3a4 4 0 0 1 0 8M19 13a6 6 0 0 1 3 5v4"],
  ["dates", "Upcoming Dates", "M3 5h18v17H3zM7 2v6M17 2v6M3 10h18M7 14h2M15 14h2M7 18h2M15 18h2"],
  ["gifts", "All Gifts", "M3 8h18v5H3zM5 13v9h14v-9M12 8v14M12 8H8a3 3 0 1 1 3-3l1 3ZM12 8h4a3 3 0 1 0-3-3l-1 3Z"],
];
const settingsPath = "M10 2h4l1 4 4-1 2 4-3 3 3 3-2 4-4-1-1 4h-4l-1-4-4 1-2-4 3-3-3-3 2-4 4 1 1-4ZM16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z";

// The app's side navigation, composed from Carbon's cds-side-nav so it keeps Carbon's
// landmark/aria roles, keyboard handling and focus styles. The look comes from the
// cds-side-nav rules in brand-theme.css and the .page-sidenav-footer rules in
// page-templates.css.
//
// It renders into the light DOM (no shadow root) on purpose: those page-level rules, and
// carbon-shape-overrides.js, can only reach cds-side-nav when it is in the document tree.
export class SideNav extends LitElement {
  static properties = {
    active: { type: String },
  };

  constructor() {
    super();
    this.active = "dashboard";
  }

  createRenderRoot() {
    return this;
  }

  // Destinations do not exist yet. The page assembler can listen for side-nav-select
  // (detail: { item }) to connect routes/actions without changing this component.
  _select(event, item) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent("side-nav-select", {
      detail: { item }, bubbles: true, composed: true,
    }));
  }

  _icon(path, slot = "title-icon") {
    return html`<svg slot=${slot} viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true" focusable="false"><path d=${path}></path></svg>`;
  }

  _link(item, label, path) {
    return html`
      <cds-side-nav-link href="#${item}" ?active=${this.active === item}
        aria-current=${this.active === item ? "page" : nothing}
        @click=${event => this._select(event, item)}>
        ${this._icon(path)}${label}
      </cds-side-nav-link>
    `;
  }

  render() {
    return html`
      <cds-side-nav expanded collapse-mode="fixed" aria-label="Gift App sidebar">
        <cds-side-nav-items>
          ${links.map(([item, label, path]) => this._link(item, label, path))}
        </cds-side-nav-items>
        <div class="page-sidenav-footer">
          <cds-button kind="primary" size="sm" @click=${event => this._select(event, "add-gift")}>
            Add Gift ${this._icon("M12 5v14M5 12h14", "icon")}
          </cds-button>
          <cds-button kind="primary" size="sm" @click=${event => this._select(event, "add-recipient")}>
            Add Recipient ${this._icon("M12 5v14M5 12h14", "icon")}
          </cds-button>
          <cds-side-nav-items>${this._link("settings", "Settings", settingsPath)}</cds-side-nav-items>
        </div>
      </cds-side-nav>
    `;
  }
}
customElements.define("gift-side-nav", SideNav);
