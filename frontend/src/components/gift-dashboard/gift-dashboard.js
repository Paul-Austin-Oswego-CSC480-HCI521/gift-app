import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "./dashboard-card.js"; // adjust paths to wherever you save these
import "./dashboard-row.js";
import { routes } from "../../config/routes.js";
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
          view-all-href=${routes.people.path}
          description="View and manage your people"
          add-label="Add Person"
          .total=${people.length}
          @add-click=${() => this._emit("add-person")}
          ?disabled=${this.loading}
        >
          <svg slot="icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" fill="white" fill-opacity="0.01"/>
            <path d="M24.3606 31H23.6406V23.5C23.6406 19.948 21.2266 16.896 17.7686 16.076C17.6186 16.04 17.5076 15.913 17.4936 15.76C17.4786 15.606 17.5646 15.46 17.7056 15.397C19.2226 14.722 20.2016 13.216 20.2016 11.561C20.2016 9.24499 18.3176 7.35999 16.0016 7.35999C13.6856 7.35999 11.8006 9.24399 11.8006 11.561C11.8006 13.216 12.7806 14.723 14.2966 15.397C14.4376 15.46 14.5236 15.606 14.5086 15.76C14.4946 15.913 14.3836 16.041 14.2336 16.076C10.7756 16.896 8.36163 19.948 8.36163 23.5V31H7.64062V23.5C7.64062 19.908 9.89762 16.782 13.2256 15.621C11.8996 14.714 11.0796 13.2 11.0796 11.56C11.0796 9.59599 12.2366 7.89599 13.9056 7.10799C14.1016 6.61699 14.2006 6.09699 14.2006 5.56099C14.2006 3.24499 12.3166 1.35999 10.0006 1.35999C7.68462 1.35999 5.79962 3.24399 5.79962 5.56099C5.79962 7.21699 6.77962 8.72299 8.29563 9.39699C8.43763 9.45999 8.52163 9.60599 8.50763 9.75999C8.49363 9.91299 8.38263 10.041 8.23263 10.076C4.77463 10.896 2.36062 13.948 2.36062 17.5V25H1.64062V17.5C1.64062 13.908 3.89762 10.782 7.22563 9.62099C5.89962 8.71399 5.08063 7.19999 5.08063 5.56099C5.08063 2.84799 7.28762 0.640991 10.0006 0.640991C12.7136 0.640991 14.9206 2.84799 14.9206 5.56099C14.9206 5.98299 14.8686 6.39699 14.7636 6.79799C15.5546 6.59299 16.4466 6.59299 17.2366 6.79799C17.1326 6.39699 17.0796 5.98299 17.0796 5.56099C17.0796 2.84799 19.2876 0.640991 22.0006 0.640991C24.7136 0.640991 26.9216 2.84799 26.9216 5.56099C26.9216 7.20099 26.1016 8.71499 24.7756 9.62199C28.1046 10.783 30.3616 13.909 30.3616 17.501V25H29.6406V17.5C29.6406 13.948 27.2266 10.896 23.7686 10.076C23.6186 10.04 23.5076 9.91299 23.4936 9.75999C23.4786 9.60599 23.5646 9.45999 23.7056 9.39699C25.2216 8.72199 26.2006 7.21599 26.2006 5.56099C26.2006 3.24499 24.3166 1.35999 22.0006 1.35999C19.6846 1.35999 17.8006 3.24399 17.8006 5.56099C17.8006 6.09699 17.8996 6.61699 18.0956 7.10899C19.7646 7.89799 20.9216 9.59699 20.9216 11.561C20.9216 13.201 20.1016 14.715 18.7756 15.622C22.1046 16.783 24.3616 19.909 24.3616 23.501L24.3606 31Z" fill="white"/>
            </svg>
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
          ?disabled=${this.loading}
        >
          <svg slot="icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" fill="white" fill-opacity="0.01"/>
            <path d="M28.0006 31.3599H4.00062C3.80162 31.3599 3.64062 31.1989 3.64062 30.9999V14.3599H3.00062C2.80162 14.3599 2.64062 14.1989 2.64062 13.9999V7.99989C2.64062 7.80089 2.80162 7.63989 3.00062 7.63989H10.2576C9.27962 6.93889 8.64062 5.79189 8.64062 4.49989C8.64062 2.37189 10.3716 0.639893 12.5006 0.639893C14.0476 0.639893 15.3856 1.55489 16.0006 2.87189C16.6156 1.55489 17.9536 0.639893 19.5006 0.639893C21.6286 0.639893 23.3606 2.37089 23.3606 4.49989C23.3606 5.79189 22.7206 6.93889 21.7436 7.63989H29.0006C29.1996 7.63989 29.3606 7.80089 29.3606 7.99989V13.9999C29.3606 14.1989 29.1996 14.3599 29.0006 14.3599H28.3606V30.9999C28.3606 31.1989 28.1996 31.3599 28.0006 31.3599ZM16.3606 30.6399H27.6406V14.3599H16.3606V30.6399ZM4.36063 30.6399H15.6406V14.3599H4.36063V30.6399ZM16.3606 13.6399H28.6406V8.35989H16.3606V13.6399ZM3.36062 13.6399H15.6406V8.35989H3.36062V13.6399ZM16.3606 7.63989H19.5006C21.2316 7.63989 22.6406 6.23089 22.6406 4.49989C22.6406 2.76889 21.2326 1.35989 19.5006 1.35989C17.7686 1.35989 16.3606 2.76889 16.3606 4.49989V7.63989ZM12.5006 7.63989H15.6406V4.49989C15.6406 2.76889 14.2316 1.35989 12.5006 1.35989C10.7696 1.35989 9.36062 2.76889 9.36062 4.49989C9.36062 6.23089 10.7696 7.63989 12.5006 7.63989Z" fill="white"/>
            </svg>
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
          view-all-href=${routes.dates.path}
          description="Keep track of important events"
          add-label="Add Date"
          .total=${dates.length}
          @add-click=${() => this._emit("add-date")}
          ?disabled=${this.loading}
        >
          <svg slot="icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="31" viewBox="0 0 29 31" fill="none">
            <path d="M28.36 30.36H0.36C0.161 30.36 0 30.199 0 30V3C0 2.801 0.161 2.64 0.36 2.64H6V0H6.72V2.64H14V0H14.72V2.64H22V0H22.721V2.64H28.36C28.559 2.64 28.72 2.801 28.72 3V30C28.72 30.199 28.559 30.36 28.36 30.36ZM0.72 29.64H28V3.36H22.72V6H22V3.36H14.72V6H14V3.36H6.72V6H6V3.36H0.72V29.64ZM23.36 26.36H21.36C21.161 26.36 21 26.199 21 26V24C21 23.801 21.161 23.64 21.36 23.64H23.36C23.559 23.64 23.72 23.801 23.72 24V26C23.72 26.199 23.559 26.36 23.36 26.36ZM21.72 25.64H22.999V24.36H21.72V25.64ZM15.36 26.36H13.36C13.161 26.36 13 26.199 13 26V24C13 23.801 13.161 23.64 13.36 23.64H15.36C15.559 23.64 15.72 23.801 15.72 24V26C15.72 26.199 15.559 26.36 15.36 26.36ZM13.72 25.64H15V24.36H13.72V25.64V25.64ZM7.36 26.36H5.36C5.161 26.36 5 26.199 5 26V24C5 23.801 5.161 23.64 5.36 23.64H7.36C7.559 23.64 7.72 23.801 7.72 24V26C7.72 26.199 7.559 26.36 7.36 26.36ZM5.72 25.64H7V24.36H5.72V25.64ZM23.36 19.36H21.36C21.161 19.36 21 19.199 21 19V17C21 16.801 21.161 16.64 21.36 16.64H23.36C23.559 16.64 23.72 16.801 23.72 17V19C23.72 19.199 23.559 19.36 23.36 19.36ZM21.72 18.64H22.999V17.36H21.72V18.64ZM15.36 19.36H13.36C13.161 19.36 13 19.199 13 19V17C13 16.801 13.161 16.64 13.36 16.64H15.36C15.559 16.64 15.72 16.801 15.72 17V19C15.72 19.199 15.559 19.36 15.36 19.36ZM13.72 18.64H15V17.36H13.72V18.64V18.64ZM7.36 19.36H5.36C5.161 19.36 5 19.199 5 19V17C5 16.801 5.161 16.64 5.36 16.64H7.36C7.559 16.64 7.72 16.801 7.72 17V19C7.72 19.199 7.559 19.36 7.36 19.36ZM5.72 18.64H7V17.36H5.72V18.64ZM23.36 12.36H21.36C21.161 12.36 21 12.199 21 12V10C21 9.801 21.161 9.64 21.36 9.64H23.36C23.559 9.64 23.72 9.801 23.72 10V12C23.72 12.199 23.559 12.36 23.36 12.36ZM21.72 11.64H22.999V10.36H21.72V11.64ZM15.36 12.36H13.36C13.161 12.36 13 12.199 13 12V10C13 9.801 13.161 9.64 13.36 9.64H15.36C15.559 9.64 15.72 9.801 15.72 10V12C15.72 12.199 15.559 12.36 15.36 12.36ZM13.72 11.64H15V10.36H13.72V11.64V11.64ZM7.36 12.36H5.36C5.161 12.36 5 12.199 5 12V10C5 9.801 5.161 9.64 5.36 9.64H7.36C7.559 9.64 7.72 9.801 7.72 10V12C7.72 12.199 7.559 12.36 7.36 12.36ZM5.72 11.64H7V10.36H5.72V11.64Z" fill="white"/>
            </svg>
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
