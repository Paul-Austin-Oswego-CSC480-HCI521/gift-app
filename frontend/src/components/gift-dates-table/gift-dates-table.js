import { LitElement, css, html, nothing } from "lit";
import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/icon-button/index.js";
import "@carbon/web-components/es/components/tag/index.js";

// SVG path data from the installed @carbon/icons package.
const ICON_PATHS = {
  anniversary:
    "M22.45,6a5.47,5.47,0,0,1,3.91,1.64,5.7,5.7,0,0,1,0,8L16,26.13,5.64,15.64a5.7,5.7,0,0,1,0-8,5.48,5.48,0,0,1,7.82,0L16,10.24l2.53-2.58A5.44,5.44,0,0,1,22.45,6m0-2a7.47,7.47,0,0,0-5.34,2.24L16,7.36,14.89,6.24a7.49,7.49,0,0,0-10.68,0,7.72,7.72,0,0,0,0,10.82L16,29,27.79,17.06a7.72,7.72,0,0,0,0-10.82A7.49,7.49,0,0,0,22.45,4Z",
  birthday:
    "M5,28c-.2607,0-.5161-.1016-.707-.293-.2749-.2744-.3657-.6836-.2329-1.0488L12.0601,4.6582c.1172-.3213.3896-.5605.7231-.6343.3335-.0757.6821.0269.9238.269l14,14c.2422.2412.3428.5898.2695.9238-.0742.333-.3135.6064-.6348.7227L5.3418,27.9395c-.1113.041-.2271.0605-.3418.0605ZM9.1367,18.5508l-2.4648,6.7773,6.7773-2.4648-4.3125-4.3125ZM9.8906,16.4766l5.6328,5.6328,3.793-1.3789-8.0464-8.0464-1.3794,3.7925ZM12.0239,10.6099l9.3657,9.3657,3.793-1.3789L13.4033,6.8174l-1.3794,3.7925ZM30,13h-4v-2h4v2ZM25.0127,8.4019l-1.4141-1.4141,3.3926-3.3931,1.4141,1.4141-3.3926,3.3931ZM21,6h-2V2h2v4Z",
  holiday:
    "M26,10H23.2383A4.4867,4.4867,0,0,0,16,4.7065,4.4873,4.4873,0,0,0,8.7617,10H6a2.0025,2.0025,0,0,0-2,2v4a2.0025,2.0025,0,0,0,2,2V28a2.0025,2.0025,0,0,0,2,2H24a2.0025,2.0025,0,0,0,2-2V18a2.0025,2.0025,0,0,0,2-2V12A2.0025,2.0025,0,0,0,26,10ZM17,7.5A2.5,2.5,0,1,1,19.5,10H17ZM12.5,5A2.503,2.503,0,0,1,15,7.5V10H12.5a2.5,2.5,0,0,1,0-5ZM6,12h9v4H6Zm2,6h7V28H8ZM24.0012,28H17V18h7ZM17,16V12h9l.0012,4Z",
  other:
    "M26,4h-4V2h-2v2h-8V2h-2v2H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h20c1.1,0,2-.9,2-2V6C28,4.9,27.1,4,26,4z M26,26H6V12h20V26z M26,10H6V6h4v2h2V6h8v2h2V6h4V10z",
};

export class GiftDatesTable extends LitElement {
  static properties = {
    dates: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      inline-size: 100%;
      max-inline-size: var(--gift-dates-table-max-width, 64rem);
      font-family: var(--font-family-body);
    }

    cds-table {
      inline-size: 100%;
    }

    cds-table-cell {
      vertical-align: middle;
    }

    cds-table-cell.days-cell {
      padding: 0;
    }

    cds-table-cell.occasion-cell,
    cds-table-cell.action-cell {
      padding-block: 0;
      text-align: center;
      vertical-align: middle;
    }

    .visually-hidden {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .days {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-inline-size: var(--cds-spacing-12, 6rem);
      min-block-size: var(--cds-spacing-12, 6rem);
      background: var(--cds-layer-accent-01);
      color: var(--cds-text-primary);
    }

    .days__number {
      font-family: var(--font-family-heading);
      font-size: var(--cds-heading-04-font-size, 1.75rem);
      line-height: var(--cds-heading-04-line-height, 2.25rem);
    }

    .days__label,
    .details__meta,
    .purchase-date {
      color: var(--cds-text-secondary);
      font-size: var(--cds-label-01-font-size, 0.875rem);
      line-height: var(--cds-label-01-line-height, 1rem);
    }


    .occasion-icon {
      display: block;
      margin-inline: auto;
      color: var(--cds-icon-interactive);
    }

    .edit-icon {
      color: var(--cds-icon-interactive);
      transform: scale(1.5);
      transform-origin: center;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-02, 0rem);
    }

    .details__person {
      font-family: var(--font-family-heading);
      font-size: var(--cds-heading-compact-01-font-size, 0.875rem);
      font-weight: 600;
    }

    .details__occasion {
      color: var(--cds-text-primary);
    }

    .status {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--cds-spacing-02, 0.25rem);
    }
    .status-cell {
      text-align:end;
    }
  `;

  constructor() {
    super();
    this.dates = [];
  }

  _occasionIcon(category) {
    const path = ICON_PATHS[category] ?? ICON_PATHS.other;
    return html`
      <svg
        class="occasion-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        <path d=${path}></path>
      </svg>
    `;
  }

  _giftSummary(date) {
    if (date.status === "purchased") return "All gifts purchased";
    const count = date.giftsToBuy ?? 0;
    return `${count} ${count === 1 ? "gift" : "gifts"} to buy`;
  }

  _renderRow(date) {
    const purchased = date.status === "purchased";
    const occasion = date.occasion ?? {};

    return html`
      <cds-table-row>
        <cds-table-cell class="days-cell">
          <span class="days">
            <span class="days__number">${date.daysUntil}</span>
            <span class="days__label">DAYS</span>
          </span>
        </cds-table-cell>
        <cds-table-cell class="occasion-cell" aria-label=${occasion.name ?? "Occasion"}>
          ${this._occasionIcon(occasion.category)}
        </cds-table-cell>
        <cds-table-cell>
          <span class="details">
            <span class="details__person">${date.person}</span>
            <span class="details__occasion">${occasion.name}</span>
            <span class="details__meta">${occasion.dateLabel} · ${this._giftSummary(date)}</span>
          </span>
        </cds-table-cell>
        <cds-table-cell class="status-cell">
          <span class="status">
            <cds-tag type=${purchased ? "green" : "red"} size="md">
              ${purchased ? "Purchased" : "Not purchased"}
            </cds-tag>

            ${purchased && date.purchaseDateLabel
              ? html`<span class="purchase-date">Purchased on ${date.purchaseDateLabel}</span>`
              : nothing}
          </span>
        </cds-table-cell>
        <cds-table-cell class="action-cell">
          <cds-icon-button kind="ghost" size="lg">
            <svg
              class="edit-icon"
              slot="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="currentColor"
              width="16"
              height="16"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M27.3069,6.1069,30,3.4141,28.5859,2,25.8931,4.6929,24.8,3.6a1.9328,1.9328,0,0,0-2.8,0L4,21.6V28h6.4l18-18a1.9329,1.9329,0,0,0,0-2.8ZM9.6,26H6V22.4L23.4,5,27,8.6Z"
              ></path>
              <path
                d="M8.136 7.5H18.863999999999997V9.5H8.136z"
                transform="rotate(-45 13.5 8.5)"
              ></path>
            </svg>
            <span slot="tooltip-content">${date.editLabel}</span>
          </cds-icon-button>
        </cds-table-cell>
      </cds-table-row>
    `;
  }

  render() {
    return html`
      <cds-table aria-label="Upcoming dates" locale="en" size="xl">
        <cds-table-head class="visually-hidden">
          <cds-table-header-row>
            <cds-table-header-cell>Days</cds-table-header-cell>
            <cds-table-header-cell>Occasion</cds-table-header-cell>
            <cds-table-header-cell>Details</cds-table-header-cell>
            <cds-table-header-cell>Status</cds-table-header-cell>
            <cds-table-header-cell>Actions</cds-table-header-cell>
          </cds-table-header-row>
        </cds-table-head>
        <cds-table-body>${this.dates.map((date) => this._renderRow(date))}</cds-table-body>
      </cds-table>
    `;
  }
}

customElements.define("gift-dates-table", GiftDatesTable);
