import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/select/index.js";
import "@carbon/web-components/es/components/multi-select/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/tag/index.js";
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
  _saveButton() { return html`<cds-button class="save" ?disabled=${this.blocked} @click=${this._save}>${this.saving ? "Saving…" : "Save Preferences"}</cds-button>`; }
  _field({ name, options = [], multiple, text }) {
    const value = this.values[name] ?? (multiple ? [] : "");
    if (text) return html`<cds-textarea label=${name} placeholder=${name === "Likes" ? "Things you’d love to receive" : "Things you would rather not receive"} .value=${value} .maxCount=${100} enable-counter ?disabled=${this.blocked} @input=${event => this._change(name, event.target.value)}></cds-textarea>`;
    const selected = multiple ? value : [value];
    const choices = [...new Set([...options, ...selected.filter(Boolean)])];
    if (multiple) return html`<cds-multi-select aria-label=${name} title-text=${name} clear-selection-label="Clear selected preferences" label="Choose an option" .value=${value.join(",")} ?disabled=${this.blocked}
      @cds-multi-select-selected=${event => this._change(name, [...event.currentTarget.querySelectorAll("cds-multi-select-item")].filter(item => item.selected).map(item => item.value))}>
      ${choices.map(option => html`<cds-multi-select-item value=${option} ?selected=${value.includes(option)}>${option}</cds-multi-select-item>`)}
    </cds-multi-select><div>${value.map(option => html`<cds-tag type="blue">${option}</cds-tag>`)}</div>`;
    return html`<cds-select placeholder="Choose an option" label-text=${name} .value=${value} ?disabled=${this.blocked} @cds-select-selected=${event => this._change(name, event.detail.value)}>
      <cds-select-item value="">Not specified</cds-select-item>
      ${choices.map(option => html`<cds-select-item value=${option}>${option}</cds-select-item>`)}
    </cds-select>`;
  }
  render() {
    return html`<cds-link href=${routes.wishlist.path}>My Wish List</cds-link>
      <h1>Your Gift Preferences</h1>
      ${this.loading ? html`<div role="status"><cds-inline-loading description="Loading preferences"></cds-inline-loading></div>` : nothing}
      ${this.error ? html`<cds-inline-notification open kind="error" title="Preferences could not be saved or loaded" subtitle=${this.error} hide-close-button></cds-inline-notification>` : nothing}
      ${this.message ? html`<cds-inline-notification open kind="success" title=${this.message} hide-close-button></cds-inline-notification>` : nothing}
      ${this.loadFailed ? html`<cds-button @click=${() => this.dispatchEvent(new CustomEvent("preferences-reload", { bubbles: true, composed: true }))}>Retry loading</cds-button>` : nothing}
      ${this._saveButton()}
      <div class="grid">${sections.map(section => html`<gift-tile class=${section.wide ? "wide" : ""}>
        <h2 slot="title">${section.title}</h2><div class="fields">${section.fields.map(field => this._field(field))}</div>
      </gift-tile>`)}</div>
      ${this._saveButton()}`;
  }
}
customElements.define("gift-full-preferences", GiftFullPreferences);
