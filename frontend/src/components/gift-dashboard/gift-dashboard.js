import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import "@carbon/web-components/es/components/tile/index.js";
import { notificationTheme } from "../../styles/notification-theme.js";

const EMPTY = "—";

// The dashboard's page content: one Carbon tile per person, each listing that person's gifts in a
// cds-structured-list. It only renders what it is given (`user`, `loading`, `error`) so stories and
// tests need no network; the page script fetches the data and listens for the two events:
//   add-gift          the Add Gift button was pressed
//   dashboard-reload  the Reload data button was pressed
export class GiftDashboard extends LitElement {
  static properties = {
    user: { type: Object },
    loading: { type: Boolean, reflect: true },
    error: { type: String },
  };

  static styles = [
    notificationTheme,
    css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-06, 1.5rem);
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--cds-spacing-05, 1rem);
    }

    /* The page-level heading rules in brand-theme.css and Carbon's cds--type-* classes cannot
       reach into this shadow root, so the heading font and sizes are set here from the brand
       tokens (the h1 matches .page-title). */
    h1,
    h2 {
      margin: 0;
      font-family: var(--font-family-heading);
    }

    h1 {
      font-size: var(--page-title-font-size);
      line-height: var(--page-title-line-height);
      font-weight: var(--page-title-font-weight);
    }

    h2 {
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: 400;
    }

    .people {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-06, 1.5rem);
    }

    cds-tile {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-05, 1rem);
    }

    .empty {
      margin: 0;
      color: var(--cds-text-secondary);
    }
  `,
  ];

  constructor() {
    super();
    this.user = null;
    this.loading = false;
    this.error = "";
  }

  _emit(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  _gifts(person) {
    return html`
      <cds-structured-list aria-label=${`Gifts for ${person.fullName}`}>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell>Gift</cds-structured-list-header-cell>
            <cds-structured-list-header-cell>Type</cds-structured-list-header-cell>
            <cds-structured-list-header-cell>Status</cds-structured-list-header-cell>
            <cds-structured-list-header-cell>Occasion</cds-structured-list-header-cell>
            <cds-structured-list-header-cell>Occasion date</cds-structured-list-header-cell>
            <cds-structured-list-header-cell>Purchase date</cds-structured-list-header-cell>
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          ${person.gifts.map(
            (gift) => html`
              <cds-structured-list-row>
                <cds-structured-list-cell>${gift.name}</cds-structured-list-cell>
                <cds-structured-list-cell>${gift.type ?? EMPTY}</cds-structured-list-cell>
                <cds-structured-list-cell>
                  ${gift.status?.stage
                    ? html`<cds-tag type="gray" size="sm">${gift.status.stage}</cds-tag>`
                    : EMPTY}
                </cds-structured-list-cell>
                <cds-structured-list-cell>${gift.occasion?.name ?? EMPTY}</cds-structured-list-cell>
                <cds-structured-list-cell>${gift.occasion?.date ?? EMPTY}</cds-structured-list-cell>
                <cds-structured-list-cell>${gift.purchaseDate ?? EMPTY}</cds-structured-list-cell>
              </cds-structured-list-row>
            `
          )}
        </cds-structured-list-body>
      </cds-structured-list>
    `;
  }

  _person(person) {
    const gifts = person.gifts ?? [];
    return html`
      <cds-tile>
        <h2>${person.fullName}</h2>
        ${gifts.length
          ? this._gifts({ ...person, gifts })
          : html`<p class="empty">No gifts yet.</p>`}
      </cds-tile>
    `;
  }

  render() {
    const people = this.user?.people ?? [];
    const heading = this.user?.fullName
      ? `${this.user.fullName}'s people and gifts`
      : "People and gifts";

    return html`
      <h1>${heading}</h1>
      <div class="actions">
        <cds-button kind="primary" ?disabled=${this.loading} @click=${() => this._emit("add-gift")}>
          Add Gift
        </cds-button>
        <cds-button kind="tertiary" ?disabled=${this.loading} @click=${() => this._emit("dashboard-reload")}>
          Reload data
        </cds-button>
      </div>
      <div role="status" aria-live="polite">
        ${this.loading
          ? html`<cds-inline-loading status="active" assistive-text="Loading people and gifts">
              Loading…
            </cds-inline-loading>`
          : nothing}
      </div>
      ${this.error
        ? html`<cds-inline-notification
            kind="error"
            title="Could not load data"
            subtitle=${this.error}
            hide-close-button
          ></cds-inline-notification>`
        : nothing}
      ${!this.loading && !this.error && this.user && people.length === 0
        ? html`<cds-inline-notification
            kind="info"
            title="No people found"
            subtitle="Add a person to start tracking gifts."
            hide-close-button
          ></cds-inline-notification>`
        : nothing}
      <div class="people">${people.map((person) => this._person(person))}</div>
    `;
  }
}

customElements.define("gift-dashboard", GiftDashboard);
