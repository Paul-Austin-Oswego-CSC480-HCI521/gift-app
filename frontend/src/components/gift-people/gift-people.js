import { LitElement, html, nothing, css } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/search/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import Add16 from "@carbon/icons/es/add/16.js";
import "../gift-tile/gift-tile.js";

// Figma "People" frame (5:26022): title, a search + Add Person toolbar, then a wrapping grid of
// gift-tile cards. Page padding comes from .page-main, so the host adds none.
export class GiftPeople extends LitElement {
  static properties = {
    people: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    search: { type: String },
    showForm: { type: Boolean },
  };

  static styles = css`
    :host {
      display: flex;
      inline-size: 100%;
      flex-direction: column;
      gap: var(--cds-spacing-07, 2rem); /* Figma: 32 between header, toolbar and grid */
      color: var(--cds-text-primary);
    }

    h1 {
      margin: 0;
      font-family: var(--font-family-heading);
      font-size: 3.375rem;
      font-weight: 300;
      line-height: 4rem;
    }

    h2 {
      margin: 0;
      font-family: var(--font-family-heading);
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--cds-spacing-05);
    }

    cds-search {
      inline-size: 22.375rem; /* Figma: 358 */
      max-inline-size: 100%;
    }

    .grid {
      display: grid;
      inline-size: 100%;
      box-sizing: border-box;
      grid-template-columns: repeat(auto-fill, minmax(15.625rem, 1fr)); /* Figma tile: 250 minimum */
      row-gap: 1.5rem; /* Figma: 24 vertical */
      column-gap: 1.125rem; /* Figma: 18 horizontal */
      /* room for the tile's offset shadow so the page does not clip it */
      padding: 2px 8px 8px 2px;
    }

    /* gift-tile caps its width at the Figma card size; here the cards stretch to fill their grid column. */
    gift-tile {
      max-inline-size: none;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-05);
      padding: 1.25rem; /* 20px */
      background: var(--cds-layer-01);
    }

    .form-actions {
      display: flex;
      gap: var(--cds-spacing-05);
    }

    .message {
      margin: 0;
    }

    @media (max-width: 500px) {
      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      cds-search {
        inline-size: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.people = [];
    this.loading = false;
    this.error = "";
    this.search = "";
    this.showForm = false;
  }

  get filteredPeople() {
    const term = this.search.trim().toLocaleLowerCase();
    return [...(Array.isArray(this.people) ? this.people : [])]
      .sort((a, b) =>
        (a.firstName ?? "").localeCompare(b.firstName ?? "", undefined, { sensitivity: "base" }) ||
        (a.lastName ?? "").localeCompare(b.lastName ?? "", undefined, { sensitivity: "base" })
      )
      .filter((person) => {
        const name = person.fullName || [person.firstName, person.lastName].filter(Boolean).join(" ");
        return name.toLocaleLowerCase().includes(term);
      });
  }

  openForm() {
    this.showForm = true;
  }

  submitPerson(event) {
    event.preventDefault();
    const firstName = this.renderRoot.querySelector('[name="firstName"]')?.value.trim() ?? "";
    const lastName = this.renderRoot.querySelector('[name="lastName"]')?.value.trim() ?? "";
    if (!firstName || !lastName) {
      this.error = "Please enter both first and last name.";
      return;
    }
    this.error = "";
    this.dispatchEvent(new CustomEvent("add-person", {
      detail: { firstName, lastName },
      bubbles: true,
      composed: true,
    }));
  }

  updated(changed) {
    if (changed.has("people") && this.showForm) {
      this.showForm = false;
    }
  }

  render() {
    return html`
      <h1>People</h1>

      <div class="toolbar">
        <cds-search
          label-text="Search for people"
          placeholder="Search for people"
          .value=${this.search}
          @input=${(event) => { this.search = event.target.value ?? ""; }}
        ></cds-search>
        <cds-button @click=${this.openForm}>
          Add Person ${iconLoader(Add16, { slot: "icon" })}
        </cds-button>
      </div>

      ${this.showForm ? html`
        <form class="form" @submit=${this.submitPerson}>
          <h2>Add Person</h2>
          <cds-text-input name="firstName" label="First Name" required></cds-text-input>
          <cds-text-input name="lastName" label="Last Name" required></cds-text-input>
          <div class="form-actions">
            <cds-button type="submit" button-type="submit" @click=${this.submitPerson}>Save Person</cds-button>
            <cds-button kind="secondary" type="button" @click=${() => { this.showForm = false; }}>Cancel</cds-button>
          </div>
        </form>
      ` : nothing}

      ${this.error ? html`
        <cds-inline-notification kind="error" title="Error" subtitle=${this.error}></cds-inline-notification>
      ` : nothing}

      ${this.loading ? html`<div role="status" aria-live="polite">
          <cds-inline-loading status="active" assistive-text="Loading people">Loading people…</cds-inline-loading>
        </div>` : nothing}

      ${!this.loading && !this.error ? html`
        <div class="grid">
          ${this.filteredPeople.map((person) => html`
            <gift-tile type="person" href="#">
              <span>${person.fullName || [person.firstName, person.lastName].filter(Boolean).join(" ")}</span>
            </gift-tile>
          `)}
          <gift-tile type="add" add-label="Add person" @gift-tile-add=${this.openForm}></gift-tile>
        </div>
        ${this.filteredPeople.length === 0 ? html`
          <p class="message">${this.search ? "No matching people found." : "No people yet. Add your first person."}</p>
        ` : nothing}
      ` : nothing}
    `;
  }
}

customElements.define("gift-people", GiftPeople);
