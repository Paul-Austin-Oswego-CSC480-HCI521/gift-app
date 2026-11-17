import { LitElement, html } from "lit";
import "@carbon/web-components/es/components/content-switcher/index.js";
import { THEME_CHANGE_EVENT, getPreference, setPreference } from "../../../theme/theme.js";

const options = [
  ["light", "Light"],
  ["dark", "Dark"],
  ["system", "System"],
];

// Light / Dark / System control, composed from Carbon's cds-content-switcher so it keeps Carbon's
// tab roles, arrow-key handling and focus styles. "System" follows the OS setting and is the default.
//
// The theme itself lives in src/theme/theme.js; this element only reads and sets the preference. It
// listens for THEME_CHANGE_EVENT so it stays correct if the theme changes elsewhere.
//
// It renders into the light DOM (no shadow root), like gift-side-nav, so page-level styles reach it.
export class ThemeSwitcher extends LitElement {
  static properties = {
    preference: { state: true },
  };

  constructor() {
    super();
    this.preference = getPreference();
    this._sync = () => {
      this.preference = getPreference();
    };
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._sync();
    window.addEventListener(THEME_CHANGE_EVENT, this._sync);
  }

  disconnectedCallback() {
    window.removeEventListener(THEME_CHANGE_EVENT, this._sync);
    super.disconnectedCallback();
  }

  _select(event) {
    setPreference(event.detail.item.value);
  }

  render() {
    return html`
      <cds-content-switcher data-testid="theme-switcher" size="sm"
        selected-index=${options.findIndex(([value]) => value === this.preference)}
        aria-label="Color theme" @cds-content-switcher-selected=${(event) => this._select(event)}>
        ${options.map(
          ([value, label]) => html`
            <cds-content-switcher-item data-testid="theme-switcher-${value}-item" value=${value}>
              ${label}
            </cds-content-switcher-item>
          `
        )}
      </cds-content-switcher>
    `;
  }
}
customElements.define("gift-theme-switcher", ThemeSwitcher);
