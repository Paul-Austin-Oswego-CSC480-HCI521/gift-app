import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/search/index.js";
import "@carbon/web-components/es/components/pagination/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/select/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/popover/index.js";
import "@carbon/web-components/es/components/notification/index.js";

// Temporary metadata only: these fields do not exist in the wishlist API yet.
export const previewMetadata = { priority: "Medium", status: "Wanted", added: "" };
const priorities = ["High", "Medium", "Low"];
const statuses = ["Wanted", "Received"];

export class WishlistTable extends LitElement {
  static properties = {
    items: { attribute: false }, loading: { type: Boolean }, saving: { type: Boolean },
    error: { type: String }, saveError: { type: String },
    _query: { state: true }, _page: { state: true }, _pageSize: { state: true },
    _filters: { state: true }, _draftFilters: { state: true }, _filterOpen: { state: true },
    _draft: { state: true }, _errors: { state: true },
  };
  static styles = css`
    :host { display: block; min-width: 0; }
    cds-tile { background: var(--card-background); border-radius: var(--radius-large); }
    h2 { margin: 0 0 var(--cds-spacing-05, 1rem); font-family: var(--font-family-heading); font-size: var(--cds-heading-03-font-size, 1.25rem); }
    .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--cds-spacing-04, 0.75rem); margin-bottom: var(--cds-spacing-05, 1rem); }
    cds-search { flex: 1; min-width: min(12rem, 100%); }
    .scroll { overflow-x: auto; }
    cds-table, cds-pagination { min-width: 36rem; }
    cds-table { --cds-layer: var(--card-background); --cds-layer-01: var(--card-background); }
    .toolbar > cds-button { max-width: 100%; }
    .toolbar > cds-button::part(button) { min-inline-size: 0; white-space: normal; }
    .filter { padding: var(--cds-spacing-05, 1rem); min-width: 14rem; }
    .filter p { margin-block: var(--cds-spacing-04, 0.75rem); }
    .actions { display: flex; gap: var(--cds-spacing-03, 0.5rem); margin-top: var(--cds-spacing-04, 0.75rem); }
    .fields { display: flex; flex-direction: column; gap: var(--cds-spacing-05, 1rem); }
    .note { color: var(--cds-text-secondary); font-size: var(--cds-helper-text-01-font-size, 0.75rem); }
    cds-inline-notification { margin-block: var(--cds-spacing-04, 0.75rem); }
  `;
  constructor() {
    super();
    this.items = []; this.loading = false; this.saving = false;
    this.error = ""; this.saveError = ""; this._query = "";
    this._page = 1; this._pageSize = 7; this._filters = []; this._draftFilters = [];
    this._filterOpen = false; this._draft = null; this._errors = {};
  }
  get filteredItems() {
    const query = this._query.trim().toLowerCase();
    const groups = [["priority", priorities], ["status", statuses]].map(([key, values]) =>
      [key, this._filters.filter(value => values.includes(value))]);
    return this.items.map(item => ({ ...previewMetadata, ...item })).filter(item =>
      item.giftName.toLowerCase().includes(query) &&
      groups.every(([key, selected]) => !selected.length || selected.includes(item[key])));
  }
  _edit(item = null) {
    this._opener = this.renderRoot.activeElement;
    this.saveError = ""; this._errors = {};
    this._draft = { ...previewMetadata, giftName: "", value: "", ...item };
  }
  closeEditor() {
    if (this.saving) return;
    this._draft = null;
    this._opener?.focus();
  }
  _submit() {
    if (this.saving || !this._draft) return;
    const giftName = this._draft.giftName.trim();
    const value = String(this._draft.value).trim();
    this._errors = {
      giftName: giftName ? "" : "Enter an item name.",
      value: /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value) && Number.isFinite(Number(value)) ? "" : "Enter a non-negative price with up to two decimal places.",
    };
    const invalid = Object.keys(this._errors).find(key => this._errors[key]);
    if (invalid) { this.renderRoot.querySelector(`[name="${invalid}"]`).focus(); return; }
    this.dispatchEvent(new CustomEvent("wishlist-save", {
      detail: { ...this._draft, giftName, value }, bubbles: true, composed: true,
    }));
  }
  _setField(key, value) { this._draft = { ...this._draft, [key]: value }; }
  _filterKeydown(event) {
    if (event.key === "Escape") {
      this._filterOpen = false;
      this.renderRoot.querySelector("#filter-toggle").focus();
    }
  }
  _date(value) {
    if (!value) return "—";
    const [year, month, day] = value.split("-");
    return `${month}/${day}/${year}`;
  }
  _select(label, key, values) {
    return html`<cds-select label-text=${label} name=${key} .value=${this._draft[key]}
      ?disabled=${this.saving} @cds-select-selected=${event => this._setField(key, event.detail.value)}>${values.map(value => html`<cds-select-item value=${value}>${value}</cds-select-item>`)}</cds-select>`;
  }
  _editor() {
    if (!this._draft) return nothing;
    const title = this._draft.id != null ? "Edit item" : "Add item";
    return html`<cds-modal open aria-label=${title}
      ?prevent-close=${this.saving} @cds-modal-closed=${() => this.closeEditor()}>
      <cds-modal-header><cds-modal-close-button ?disabled=${this.saving}></cds-modal-close-button>
        <cds-modal-heading>${title}</cds-modal-heading></cds-modal-header>
      <cds-modal-body><div class="fields">
        <cds-text-input name="giftName" label="Item" required data-modal-primary-focus
          .value=${this._draft.giftName} ?disabled=${this.saving}
          ?invalid=${Boolean(this._errors.giftName)} invalid-text=${this._errors.giftName || ""}
          @input=${event => this._setField("giftName", event.target.value)}></cds-text-input>
        <cds-text-input name="value" label="Price" required .value=${this._draft.value}
          helper-text="Enter a price such as 25.00." ?disabled=${this.saving}
          ?invalid=${Boolean(this._errors.value)} invalid-text=${this._errors.value || ""}
          @input=${event => this._setField("value", event.target.value)}></cds-text-input>
        ${this._select("Priority (preview)", "priority", priorities)}
        ${this._select("Status (preview)", "status", statuses)}
        <cds-text-input name="added" label="Added (preview)" type="date" .value=${this._draft.added}
          ?disabled=${this.saving} @input=${event => this._setField("added", event.target.value)}></cds-text-input>
        <p class="note">Priority, status, and added date are preview data for this session only. Only the item and price are saved.</p>
        ${this.saveError ? html`<cds-inline-notification open kind="error" title="Could not save item"
          subtitle=${this.saveError} hide-close-button></cds-inline-notification>` : nothing}
      </div></cds-modal-body>
      <cds-modal-footer><cds-button kind="secondary" ?disabled=${this.saving} @click=${() => this.closeEditor()}>Cancel</cds-button>
        <cds-button ?disabled=${this.saving} @click=${this._submit}>${this.saving ? "Saving…" : "Save item"}</cds-button></cds-modal-footer>
    </cds-modal>`;
  }
  render() {
    const rows = this.filteredItems;
    const page = Math.min(this._page, Math.max(1, Math.ceil(rows.length / this._pageSize)));
    return html`<cds-tile><h2>My Wish List</h2>
      <div class="toolbar">
        <cds-search label-text="Search wish list" close-button-label-text="Clear search" placeholder="Search items" .value=${this._query}
          @cds-search-input=${event => { this._query = event.detail.value; this._page = 1; }}></cds-search>
        <cds-popover ?open=${this._filterOpen} align="bottom" @keydown=${this._filterKeydown}>
          <cds-button id="filter-toggle" kind="ghost" tooltip-text="Filter wish list" aria-expanded=${this._filterOpen}
            @click=${() => { this._draftFilters = [...this._filters]; this._filterOpen = !this._filterOpen; }}>
            <svg slot="icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1 2h14v1l-6 6v5H7V9L1 3zm2 1 5 5 5-5z"></path></svg>
          </cds-button>
          <cds-popover-content><div class="filter"><strong>Filter wish list</strong>
            ${[["Status", statuses], ["Priority", priorities]].map(([label, values]) => html`<p>${label}</p>
              ${values.map(value => html`<cds-checkbox label-text=${value} ?checked=${this._draftFilters.includes(value)}
                @cds-checkbox-changed=${event => { this._draftFilters = event.target.checked ? [...this._draftFilters, value] : this._draftFilters.filter(v => v !== value); }}></cds-checkbox>`)}`)}
            <div class="actions"><cds-button kind="secondary" size="sm" @click=${() => { this._draftFilters = []; }}>Reset</cds-button>
              <cds-button size="sm" @click=${() => { this._filters = [...this._draftFilters]; this._page = 1; this._filterOpen = false; this.renderRoot.querySelector("#filter-toggle").focus(); }}>Apply</cds-button></div>
          </div></cds-popover-content>
        </cds-popover>
        <cds-button ?disabled=${this.loading} @click=${() => this._edit()}>Add to My Wish List
          <span slot="icon" aria-hidden="true">+</span></cds-button>
      </div>
      <p class="note">Priority, status, and added date are preview values until backend support is available.</p>
      ${this.error ? html`<cds-inline-notification open kind="error" title="Could not load wish list" subtitle=${this.error} hide-close-button></cds-inline-notification>` : nothing}
      ${this.loading ? html`<p role="status">Loading wish list…</p>` : nothing}
      ${!this.loading && !this.error && !rows.length ? html`<p role="status">${this.items.length ? "No matching items. Try another search or reset the filters." : "Your wish list is empty. Add an item you would like to receive."}</p>` : nothing}
      <div class="scroll"><cds-table aria-label="My wish list">
        <cds-table-head><cds-table-header-row>${["Item", "Priority", "Status", "Added", "Actions"].map(label => html`<cds-table-header-cell>${label}</cds-table-header-cell>`)}</cds-table-header-row></cds-table-head>
        <cds-table-body>${rows.slice((page - 1) * this._pageSize, page * this._pageSize).map(item => {
          return html`<cds-table-row><cds-table-cell>${item.giftName}</cds-table-cell><cds-table-cell>${item.priority}</cds-table-cell>
            <cds-table-cell>${item.status}</cds-table-cell><cds-table-cell>${this._date(item.added)}</cds-table-cell>
            <cds-table-cell><cds-button kind="ghost" size="sm" tooltip-text=${`Edit ${item.giftName}`} @click=${() => this._edit(item)}>Edit</cds-button></cds-table-cell></cds-table-row>`;
        })}</cds-table-body></cds-table>
      <cds-pagination items-per-page-text="Items per page:" .page=${page} .pageSize=${this._pageSize} .totalItems=${rows.length}
        @cds-pagination-changed-current=${event => { this._page = event.detail.page; }}
        @cds-page-sizes-select-changed=${event => { this._pageSize = event.detail.pageSize; this._page = 1; }}>
        ${[7, 14, 28].map(size => html`<cds-select-item value=${size}>${size}</cds-select-item>`)}
      </cds-pagination></div>
    </cds-tile>${this._editor()}`;
  }
}
customElements.define("gift-wishlist-table", WishlistTable);
