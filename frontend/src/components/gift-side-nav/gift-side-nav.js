import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/button/index.js";

const links = [
  ["dashboard", "Dashboard", "M3 10 12 2l9 8M5 9v12h14V9M10 21v-7h4v7"],
  ["wishlist", "My Wish List", "M3 4h3v3H3zM3 11h3v3H3zM3 18h3v3H3zM10 5h11M10 12h11M10 19h11"],
  ["people", "People", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 22v-4a7 7 0 0 1 14 0v4M17 3a4 4 0 0 1 0 8M19 13a6 6 0 0 1 3 5v4"],
  ["dates", "Upcoming Dates", "M3 5h18v17H3zM7 2v6M17 2v6M3 10h18M7 14h2M15 14h2M7 18h2M15 18h2"],
  ["gifts", "All Gifts", "M3 8h18v5H3zM5 13v9h14v-9M12 8v14M12 8H8a3 3 0 1 1 3-3l1 3ZM12 8h4a3 3 0 1 0-3-3l-1 3Z"],
];

export class SideNav extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 12rem;
      max-width: 100%;
      color: var(--gift-side-nav-color, #1c5147);
      --cds-button-primary: var(--gift-side-nav-color, #1c5147);
      --cds-button-primary-hover: #153e36;
      --cds-button-primary-active: #103129;
      --cds-focus: var(--gift-side-nav-color, #1c5147);
    }
    nav {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      min-height: var(--gift-side-nav-height, 42rem);
      padding: var(--cds-spacing-06, 1.5rem) var(--cds-spacing-03, 0.5rem);
      border-radius: 0.25rem;
      background: var(--gift-side-nav-background, #fbfaf3);
      font-family: "IBM Plex Sans", sans-serif;
    }
    ul { list-style: none; padding: 0; margin: 0; }
    a {
      display: flex;
      align-items: center;
      gap: var(--cds-spacing-03, 0.5rem);
      min-height: 3.5rem;
      padding-inline: var(--cds-spacing-03, 0.5rem);
      color: inherit;
      text-decoration: none;
      font-size: 0.875rem;
      line-height: 1.5;
      border-radius: 0.125rem;
    }
    a:hover { background: #e9eee6; text-decoration: underline; }
    a:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }
    svg { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
    .bottom { margin-top: auto; padding-top: var(--cds-spacing-09, 3rem); }
    .actions {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-04, 0.75rem);
      padding: var(--cds-spacing-05, 1rem);
    }
    cds-button { width: 100%; }
    cds-button::part(button) { width: 100%; padding-inline: 0.75rem; font-size: 0.75rem; }
  `;

  // Destinations do not exist yet. The page assembler can listen for side-nav-select
  // (detail: { item }) to connect routes/actions without changing this component.
  _select(event, item) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent("side-nav-select", {
      detail: { item }, bubbles: true, composed: true,
    }));
  }

  _icon(path) {
    return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true" focusable="false"><path d=${path}></path></svg>`;
  }

  render() {
    return html`
      <nav aria-label="Gift App sidebar">
        <ul>
          ${links.map(([item, label, path]) => html`
            <li><a href="#${item}" @click=${event => this._select(event, item)}>
              ${this._icon(path)}${label}
            </a></li>
          `)}
        </ul>
        <div class="bottom">
          <div class="actions">
            <cds-button size="sm" @click=${event => this._select(event, "add-gift")}>
              Add Gift <span slot="icon" aria-hidden="true">+</span>
            </cds-button>
            <cds-button size="sm" @click=${event => this._select(event, "add-recipient")}>
              Add Recipient <span slot="icon" aria-hidden="true">+</span>
            </cds-button>
          </div>
          <a href="#settings" @click=${event => this._select(event, "settings")}>
            ${this._icon("M10 2h4l1 4 4-1 2 4-3 3 3 3-2 4-4-1-1 4h-4l-1-4-4 1-2-4 3-3-3-3 2-4 4 1 1-4ZM16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z")}
            Settings
          </a>
        </div>
      </nav>
    `;
  }
}
customElements.define("gift-side-nav", SideNav);
