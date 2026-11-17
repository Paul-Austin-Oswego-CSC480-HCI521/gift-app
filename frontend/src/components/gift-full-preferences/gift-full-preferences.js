import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/select/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";

import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/link/index.js";
import "../gift-tile/gift-tile.js";
import { pageContentStyles } from "../../styles/page-content.js";
import { notificationTheme } from "../../styles/notification-theme.js";
import { sections } from "./full-preferences-model.js";
import { routes } from "../../config/routes.js";

export class GiftFullPreferences extends LitElement {
  static properties = {
    values: { attribute: false },
    loading: { type: Boolean },
    saving: { type: Boolean },
    error: { type: String },
    message: { type: String },
    loadFailed: { type: Boolean },
  };
  static styles = [notificationTheme, pageContentStyles, css`
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--cds-spacing-07, 2rem); }
    gift-tile { max-inline-size: none; min-inline-size: 0; }
    .wide { grid-column: 1 / -1; }
    h2 { margin: 0; padding-block-end: var(--cds-spacing-03, .5rem); border-bottom: 1px solid var(--cds-border-subtle); font-family: var(--font-family-heading); font-size: var(--cds-heading-03-font-size, 1.25rem); font-weight: 400; }
    .fields { display: flex; flex-direction: column; gap: var(--cds-spacing-05, 1rem); }
    .sticky-header { position: sticky; top: 3rem; z-index: 1; background: var(--cds-background); display: flex; flex-direction: column; gap: var(--cds-spacing-05, 1rem); padding-block: var(--cds-spacing-04, .75rem); }
    .save { align-self: flex-start; }
    @media (max-width: 42rem) { .grid { grid-template-columns: minmax(0, 1fr); } }
  `];
  constructor() {
    super();
    this.values = {};
    this.loading = false;
    this.saving = false;
    this.loadFailed = false;
    this.error = "";
    this.message = "";
  }
  get blocked() { return this.loading || this.saving || this.loadFailed; }
  _change(name, value) { this.values = { ...this.values, [name]: value }; this.message = ""; }
  _save() {
    if (this.blocked) return;
    this.dispatchEvent(new CustomEvent("preferences-save", { detail: { ...this.values }, bubbles: true, composed: true }));
  }
  _slug(name) { return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  _saveButton(position) { return html`<cds-button class="save" data-testid="full-preferences-save-${position}-button" ?disabled=${this.blocked} @click=${this._save}>${this.saving ? "Saving…" : "Save Preferences"}</cds-button>`; }
  _field({ name, options, multiline }) {
    const value = this.values[name] ?? "";
    if (multiline) return html`<cds-textarea data-testid="full-preferences-${this._slug(name)}-textarea" label=${name} .value=${value} .maxCount=${100} enable-counter ?disabled=${this.blocked} @input=${event => this._change(name, event.target.value)}></cds-textarea>`;
    if (!options) return html`<cds-text-input data-testid="full-preferences-${this._slug(name)}-input" label=${name} .value=${value} ?disabled=${this.blocked} @input=${event => this._change(name, event.target.value)}></cds-text-input>`;
    const choices = [...new Set([...options, ...value ? [value] : []])];
    return html`<cds-select data-testid="full-preferences-${this._slug(name)}-select" placeholder="Choose an option" label-text=${name} .value=${value} ?disabled=${this.blocked} @cds-select-selected=${event => this._change(name, event.detail.value)}>
      <cds-select-item value="">Not specified</cds-select-item>
      ${choices.map(option => html`<cds-select-item value=${option}>${option}</cds-select-item>`)}
    </cds-select>`;
  }
  render() {
    return html`<cds-link data-testid="full-preferences-wishlist-link" href=${routes.wishlist.path}>My Wish List</cds-link>
      <header class="sticky-header"><h1 data-testid="full-preferences-heading">Your Gift Preferences</h1>${this._saveButton("top")}</header>
      ${this.loading ? html`<div role="status" data-testid="full-preferences-loading"><cds-inline-loading description="Loading preferences"></cds-inline-loading></div>` : nothing}
      ${this.error ? html`<cds-inline-notification open data-testid="full-preferences-error-banner" kind="error" title="Preferences could not be saved or loaded" subtitle=${this.error} hide-close-button></cds-inline-notification>` : nothing}
      ${this.message ? html`<cds-inline-notification open data-testid="full-preferences-success-banner" kind="success" title=${this.message} hide-close-button></cds-inline-notification>` : nothing}
      ${this.loadFailed ? html`<cds-button data-testid="full-preferences-retry-button" @click=${() => this.dispatchEvent(new CustomEvent("preferences-reload", { bubbles: true, composed: true }))}>Retry loading</cds-button>` : nothing}
      <div class="grid">${sections.map(section => html`<gift-tile data-testid="full-preferences-${this._slug(section.title)}-section" class=${section.wide ? "wide" : ""}>
        <h2 slot="title">${section.title}</h2><div class="fields">${section.fields.map(field => this._field(field))}</div>
      </gift-tile>`)}</div>
      ${this._saveButton("bottom")}`;
  }
}
customElements.define("gift-full-preferences", GiftFullPreferences);
