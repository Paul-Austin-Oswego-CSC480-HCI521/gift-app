import { LitElement, html, nothing, unsafeCSS } from "lit";
import peopleStyles from "../../styles/people.css?inline";

import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/search/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/notification/index.js";

export class GiftPeople extends LitElement {
  static properties = {
    people: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    search: { type: String },
    showForm: { type: Boolean },
  };

  static styles = unsafeCSS(peopleStyles);

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
      <h1 class="cds--type-heading-05">People</h1>

      <div class="toolbar">
        <cds-search
          label-text="Search for people"
          placeholder="Search for people"
          .value=${this.search}
          @input=${(event) => { this.search = event.target.value ?? ""; }}
        ></cds-search>
        <cds-button @click=${this.openForm}>Add Person +</cds-button>
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

      ${this.loading ? html`<p class="message" role="status">Loading people...</p>` : nothing}

      ${!this.loading && !this.error ? html`
        <div class="grid">
          ${this.filteredPeople.map((person) => html`
            <cds-tile class="person-card">
              <span>${person.fullName || [person.firstName, person.lastName].filter(Boolean).join(" ")}</span>
              <span aria-hidden="true">→</span>
            </cds-tile>
          `)}
          <button class="add-card" type="button" aria-label="Add Person" @click=${this.openForm}>+</button>
        </div>
        ${this.filteredPeople.length === 0 ? html`
          <p class="message">${this.search ? "No matching people found." : "No people yet. Add your first person."}</p>
        ` : nothing}
      ` : nothing}
    `;
  }
}

customElements.define("gift-people", GiftPeople);