import { LitElement, css, html, nothing } from "lit";
import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/icon-button/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import Checkmark16 from "@carbon/icons/es/checkmark/16.js";
import BatPictogram from "@carbon/pictograms/es/bat--01";
import BirthdayCakePictogram from "@carbon/pictograms/es/birthday--cake";
import CalendarPictogram from "@carbon/pictograms/es/calendar";
import GiftPictogram from "@carbon/pictograms/es/gift";
import PencilPictogram from "@carbon/pictograms/es/pencil";
import WeddingCakePictogram from "@carbon/pictograms/es/wedding--cake";

// Occasion category -> pictogram, from the Figma date entries (Date Row 26:3371). Pictograms are
// 64px by default; the design draws them at 32px.
const PICTOGRAM_SIZE = 32;
const OCCASION_PICTOGRAMS = {
  birthday: BirthdayCakePictogram,
  anniversary: WeddingCakePictogram,
  halloween: BatPictogram,
  holiday: GiftPictogram,
  other: CalendarPictogram,
};

// Figma "Date Row": a days tile, an occasion pictogram, details, a status tag and an edit action.
// Carbon data table rows have no slot for the day-count tile and pictogram, so the rows are
// composed from cds-table cells. Emits `date-edit` ({ id }) when a row's edit button is pressed.
export class GiftDatesTable extends LitElement {
  static properties = {
    dates: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      inline-size: 100%;
      font-family: var(--font-family-body);
    }

    cds-table {
      inline-size: 100%;
    }

    cds-table-cell {
      vertical-align: middle;
      background: var(--cds-layer-01);
      border-block-end: 1px solid var(--cds-border-subtle-01);
    }

    cds-table-cell.days-cell,
    cds-table-cell.occasion-cell {
      padding: 0;
      inline-size: 5.4375rem; /* Figma: 87 square tiles */
    }

    cds-table-cell.occasion-cell {
      background: var(--cds-layer-02);
      text-align: center;
      color: var(--cds-icon-interactive);
    }

    cds-table-cell.status-cell {
      text-align: end;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      block-size: 5.4375rem;
      background: var(--cds-layer-accent-01);
      color: var(--card-heading);
      font-size: var(--cds-heading-03-font-size, 1.25rem);
      line-height: var(--cds-heading-03-line-height, 1.75rem);
    }

    .days__label,
    .details__meta,
    .purchase-date {
      font-size: var(--cds-label-01-font-size, 0.75rem);
      line-height: var(--cds-label-01-line-height, 1rem);
      letter-spacing: var(--cds-label-01-letter-spacing, 0.32px);
    }

    .occasion-icon {
      display: block;
      margin-inline: auto;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-02, 0.25rem);
      color: var(--cds-text-secondary);
    }

    .details__person {
      font-family: var(--font-family-heading);
      font-size: var(--cds-heading-compact-01-font-size, 0.875rem);
      line-height: var(--cds-heading-compact-01-line-height, 1.125rem);
      font-weight: 600;
    }

    .status {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--cds-spacing-02, 0.25rem);
    }

    .purchase-date {
      display: inline-flex;
      align-items: center;
      gap: var(--cds-spacing-02, 0.25rem);
      color: var(--cds-text-secondary);
    }
  `;

  constructor() {
    super();
    this.dates = [];
  }

  _occasionIcon(category) {
    return iconLoader(OCCASION_PICTOGRAMS[category] ?? OCCASION_PICTOGRAMS.other, {
      class: "occasion-icon",
      width: PICTOGRAM_SIZE,
      height: PICTOGRAM_SIZE,
      "aria-hidden": "true",
    });
  }

  _giftSummary(date) {
    if (date.status === "purchased") return "All gifts purchased";
    const count = date.giftsToBuy ?? 0;
    return `${count} ${count === 1 ? "gift" : "gifts"} to buy`;
  }

  _onEdit(date) {
    this.dispatchEvent(
      new CustomEvent("date-edit", { bubbles: true, composed: true, detail: { id: date.id } })
    );
  }

  _renderRow(date) {
    const purchased = date.status === "purchased";
    const occasion = date.occasion ?? {};

    return html`
      <cds-table-row>
        <cds-table-cell class="days-cell">
          <span class="days">
              <span class="days__number">${date.daysUntil ?? "—"}</span>
              ${date.daysUntil !== null && date.daysUntil !== undefined
                ? html`<span class="days__label">${date.daysUntil === 1 ? "DAY" : "DAYS"}</span>`
                : nothing}
          </span>
        </cds-table-cell>
        <cds-table-cell class="occasion-cell" aria-label=${occasion.name ?? "Occasion"}>
          ${this._occasionIcon(occasion.category)}
        </cds-table-cell>
        <cds-table-cell>
          <span class="details">
            <span class="details__person">${date.person}</span>
            <span class="details__meta">${occasion.name}</span>
            <span class="details__meta">${occasion.dateLabel} · ${this._giftSummary(date)}</span>
          </span>
        </cds-table-cell>
        <cds-table-cell class="status-cell">
          <span class="status">
            <cds-tag type=${purchased ? "green" : "red"} size="md">
              ${purchased ? "Purchased" : "Not purchased"}
            </cds-tag>
            ${purchased && date.purchaseDateLabel
              ? html`<span class="purchase-date">
                  ${iconLoader(Checkmark16, { "aria-hidden": "true" })}
                  Purchased on ${date.purchaseDateLabel}
                </span>`
              : nothing}
          </span>
        </cds-table-cell>
        <cds-table-cell class="action-cell">
          <cds-icon-button kind="ghost" size="lg" @click=${() => this._onEdit(date)}>
            ${iconLoader(PencilPictogram, {
              slot: "icon",
              width: PICTOGRAM_SIZE,
              height: PICTOGRAM_SIZE,
              "aria-hidden": "true",
            })}
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
