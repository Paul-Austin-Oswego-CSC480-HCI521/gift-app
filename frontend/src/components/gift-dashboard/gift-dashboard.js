import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "./dashboard-card.js"; // adjust paths to wherever you save these
import "./dashboard-row.js";
import { notificationTheme } from "../../styles/notification-theme.js";

const MAX_ROWS = 7;

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Date-only strings (2026-10-23) parse as UTC and can show up a day early locally,
// so pin them to local midnight.
function toDate(value) {
  if (!value) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// "October 23rd, 2026", matching the mockup
function formatDate(value) {
  const d = toDate(value);
  if (!d) return "";
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${month} ${ordinal(d.getDate())}, ${d.getFullYear()}`;
}

// The dashboard's page content: three summary cards (People, Gifts to Buy, Upcoming Dates).
// It only renders what it is given (`user`, `loading`, `error`) so stories and tests need no
// network; the page script fetches the data and listens for these events:
//   add-person   the Add Person button was pressed
//   add-gift     the Add Gift button was pressed
//   add-date     the Add Date button was pressed
//   gift-toggle  a gift checkbox changed; detail: { gift, checked }
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

      /* brand-theme.css's heading rules can't reach into this shadow root. */
      h1 {
        margin: 0;
        font-family: var(--font-family-heading);
        font-size: var(--page-title-font-size);
        line-height: var(--page-title-line-height);
        font-weight: var(--page-title-font-weight);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        align-items: start;
      }

      @media (max-width: 66rem) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.user = null;
    this.loading = false;
    this.error = "";
  }

  _emit(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, { bubbles: true, composed: true, detail })
    );
  }

  // All three cards come from user.people[].gifts[]
  _derive() {
    const people = this.user?.people ?? [];
    const gifts = people.flatMap((p) => p.gifts ?? []);

    // Add-gift modal saves "need to buy" as stage "updated", so filter on not-purchased.
    const toBuy = gifts.filter((g) => g.status?.stage !== "purchased");

    // Unique upcoming occasions, soonest first. Only finds occasions that have a gift
    // attached; swap for an occasions endpoint if the backend has one.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const seen = new Map();
    for (const g of gifts) {
      const d = toDate(g.occasion?.date);
      if (!g.occasion || !d || d < today) continue;
      seen.set(`${g.occasion.name}|${g.occasion.date}`, g.occasion);
    }
    const dates = [...seen.values()].sort(
      (a, b) => toDate(a.date) - toDate(b.date)
    );

    return { people, toBuy, dates };
  }

  render() {
    const { people, toBuy, dates } = this._derive();

    return html`
      <h1>Welcome!</h1>

      <div role="status" aria-live="polite">
        ${this.loading
          ? html`<cds-inline-loading
              status="active"
              assistive-text="Loading people and gifts"
            >
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

      <div class="grid">
        <dashboard-card
          heading="People"
          description="View and manage your people"
          add-label="Add Person"
          .total=${people.length}
          @add-click=${() => this._emit("add-person")}
        >
          <svg slot="icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <!-- paste people icon path -->
          </svg>
          ${people.slice(0, MAX_ROWS).map(
            (p) => html`
              <dashboard-row
                heading=${p.fullName ?? "Unnamed person"}
                subtitle=${p.relationship ?? ""}
              ></dashboard-row>
            `
          )}
        </dashboard-card>

        <dashboard-card
          heading="Gifts to Buy"
          description="See what still needs to be purchased"
          add-label="Add Gift"
          .total=${toBuy.length}
          @add-click=${() => this._emit("add-gift")}
        >
          <svg slot="icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <!-- paste gift icon path -->
          </svg>
          ${toBuy.slice(0, MAX_ROWS).map(
            (g) => html`
              <dashboard-row
                variant="checkbox"
                heading=${g.name}
                subtitle=${formatDate(g.occasion?.date)}
                @item-toggle=${(e) =>
                  this._emit("gift-toggle", { gift: g, checked: e.detail.checked })}
              ></dashboard-row>
            `
          )}
        </dashboard-card>

        <dashboard-card
          heading="Upcoming Dates"
          description="Keep track of important events"
          add-label="Add Date"
          .total=${dates.length}
          @add-click=${() => this._emit("add-date")}
        >
          <svg slot="icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <!-- paste calendar icon path -->
          </svg>
          ${dates.slice(0, MAX_ROWS).map(
            (d) => html`
              <dashboard-row
                heading=${d.name}
                subtitle=${formatDate(d.date)}
              ></dashboard-row>
            `
          )}
        </dashboard-card>
      </div>
    `;
  }
}

customElements.define("gift-dashboard", GiftDashboard);
