import { LitElement, css, html, nothing } from "lit";
import "@carbon/web-components/es/components/icon-button/index.js";
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/link/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/pagination/index.js";
import "@carbon/web-components/es/components/search/index.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import ArrowRight16 from "@carbon/icons/es/arrow--right/16.js";
import Filter16 from "@carbon/icons/es/filter/16.js";
import "../gift-dates-table/gift-dates-table.js";
import "../gift-tile/gift-tile.js";
import { routes } from "../../config/routes.js";
import { notificationTheme } from "../../styles/notification-theme.js";
import { pageContentStyles } from "../../styles/page-content.js";
import { summarize } from "./upcoming-dates-model.js";

const PAGE_SIZES = [5, 10, 20];

// Figma "Upcoming Dates" frame (5:25841): title, three metric tiles, a search + filter toolbar, then
// the dates list with pagination. It renders what it is given (`dates`, `loading`, `error`) so
// stories and tests need no network; the page script builds `dates` from the API. Row `date-edit`
// events from the table bubble up unchanged.
export class GiftUpcomingDates extends LitElement {
  static properties = {
    dates: { type: Array },
    loading: { type: Boolean, reflect: true },
    error: { type: String },
    _query: { state: true },
    _toBuyOnly: { state: true },
    _page: { state: true },
    _pageSize: { state: true },
  };

  static styles = [
    notificationTheme,
    pageContentStyles,
    css`
      .metrics {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem; /* Figma: 20 between cards */
      }

      /* The tile caps itself at its Figma width; here the cards fill their grid column. */
      gift-tile {
        max-inline-size: none;
      }

      /* Tile text. The slotted elements belong to this shadow root, so these rules reach them. */
      .metric-title,
      .metric-value,
      .metric-description {
        margin: 0;
        font-weight: 400;
      }

      .metric-title {
        font-family: var(--font-family-heading);
        font-size: 1.625rem; /* Figma: Outfit 26 */
        line-height: normal;
        color: var(--card-heading);
      }

      .metric-value {
        font-family: var(--font-family-heading);
        font-size: 2rem; /* Figma: Outfit 32 */
        line-height: normal;
      }

      .metric-description {
        font-family: var(--font-family-body);
        font-size: 0.9375rem; /* Figma: Roboto 15 */
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: var(--cds-spacing-07, 2rem);
      }

      cds-search {
        flex: 1;
        min-inline-size: 0;
      }

      .list {
        display: flex;
        flex-direction: column;
      }

      @media (max-width: 66rem) {
        .metrics {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.dates = [];
    this.loading = false;
    this.error = "";
    this._query = "";
    this._toBuyOnly = false;
    this._page = 1;
    this._pageSize = PAGE_SIZES[0];
  }

  _visibleDates() {
    const query = this._query.trim().toLowerCase();
    return this.dates.filter((date) => {
      if (this._toBuyOnly && date.status === "purchased") return false;
      if (!query) return true;
      return [date.person, date.occasion?.name, date.occasion?.dateLabel].some((field) =>
        field?.toLowerCase().includes(query)
      );
    });
  }

  _onSearch(event) {
    this._query = event.detail.value ?? "";
    this._page = 1;
  }

  _onToggleFilter() {
    this._toBuyOnly = !this._toBuyOnly;
    this._page = 1;
  }

  _onPagination(event) {
    this._page = event.detail.page;
    this._pageSize = event.detail.pageSize;
  }

  _metric(title, { value, description }, action) {
    return html`
      <gift-tile type="metric">
        <h2 slot="title" class="metric-title">${title}</h2>
        <span slot="metric" class="metric-value">${value}</span>
        <span class="metric-description">${description}</span>
        <cds-link href=${action.href}>
          ${action.label}${iconLoader(ArrowRight16, { slot: "icon" })}
        </cds-link>
      </gift-tile>
    `;
  }

  _renderList(visible) {
    if (this.loading || this.error) return nothing;
    if (visible.length === 0) {
      const filtered = this._query || this._toBuyOnly;
      return html`<cds-inline-notification
        kind="info"
        title=${filtered ? "No matching dates" : "No upcoming dates"}
        subtitle=${filtered
          ? "Try a different search or clear the filter."
          : "Add an occasion to a gift to see it here."}
        hide-close-button
      ></cds-inline-notification>`;
    }

    const start = (this._page - 1) * this._pageSize;
    return html`
      <div class="list">
        <gift-dates-table .dates=${visible.slice(start, start + this._pageSize)}></gift-dates-table>
        <cds-pagination
          items-per-page-text="Items per page:"
          .page=${this._page}
          .pageSize=${this._pageSize}
          .totalItems=${visible.length}
          @cds-pagination-changed-current=${this._onPagination}
          @cds-page-sizes-select-changed=${this._onPagination}
        >
          ${PAGE_SIZES.map((size) => html`<cds-select-item value=${size}>${size}</cds-select-item>`)}
        </cds-pagination>
      </div>
    `;
  }

  render() {
    const summary = summarize(this.dates);
    const visible = this._visibleDates();

    return html`
      <h1>Upcoming Dates</h1>

      <div role="status" aria-live="polite">
        ${this.loading
          ? html`<cds-inline-loading status="active" assistive-text="Loading upcoming dates">
              Loading…
            </cds-inline-loading>`
          : nothing}
      </div>

      ${this.error
        ? html`<cds-inline-notification
            kind="error"
            title="Could not load upcoming dates"
            subtitle=${this.error}
            hide-close-button
          ></cds-inline-notification>`
        : nothing}

      <div class="metrics">
        ${this._metric("Dates in next 30 days", summary.soon, {
          label: "View dates",
          href: routes.dates.path,
        })}
        ${this._metric("Gifts still to buy", summary.toBuy, {
          label: "Go to gifts",
          href: routes.gifts.path,
        })}
        ${this._metric("Dates with no gift planned", summary.unplanned, {
          label: "Plan gifts",
          href: routes.gifts.path,
        })}
      </div>

      <div class="toolbar">
        <cds-search
          autocomplete="off"
          close-button-label-text="Clear search input"
          label-text="Search dates or people"
          placeholder="Search dates or people"
          size="lg"
          @cds-search-input=${this._onSearch}
        ></cds-search>
        <cds-icon-button
          kind=${this._toBuyOnly ? "primary" : "ghost"}
          size="lg"
          @click=${this._onToggleFilter}
        >
          ${iconLoader(Filter16, { slot: "icon" })}
          <span slot="tooltip-content">
            ${this._toBuyOnly ? "Show all dates" : "Show only dates with gifts to buy"}
          </span>
        </cds-icon-button>
      </div>

      ${this._renderList(visible)}
    `;
  }
}

customElements.define("gift-upcoming-dates", GiftUpcomingDates);
