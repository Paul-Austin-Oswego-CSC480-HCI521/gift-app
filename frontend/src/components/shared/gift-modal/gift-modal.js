//Note. Every gift is currently sent with the type "gift". This would need to be changed to
//something dynamic, otherwise it is redundant.

import { LitElement, html, css, nothing } from "lit";
import Add16 from "@carbon/icons/es/add/16.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/radio-button/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "../../../styles/brand-theme.css";
import "../../../styles/carbon-shape-overrides.js";
import "../../../styles/carbon-font-overrides.js";
import { apiFetch } from "../../../api/client.js";
import { getAccessToken, getUserId } from "../../../auth/token-store.js";

const STAGES = {
  "need-to-buy": "updated",
  purchased: "purchased",
};

export class GiftAddGiftModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    people: { attribute: false },
    heading: { type: String },
    submitLabel: { type: String, attribute: "submit-label" },
    fields: { attribute: false },
    _personId: { state: true },
    _saving: { state: true },
    _errors: { state: true },
  };

  static styles = css`
    cds-modal {
      font-family: var(--font-family-heading);
    }

    cds-modal::part(dialog) {
      background: var(--card-background, #fcfbf4);
      border-radius: var(--radius-large, 0.75rem);
      overflow: hidden;

      width: 32rem;
      max-width: 95vw;
      height: auto;
      block-size: auto;
      max-height: none;
    }

    cds-modal-heading {
      font-family: var(--font-family-heading);
      font-size: 2rem;
      line-height: 1.25;
      font-weight: 400;
    }

    cds-modal-header {
      overflow: visible;
      block-size: auto;
      min-block-size: 0;
    }

    cds-button::part(button),
    cds-dropdown::part(trigger-button) {
      border-radius: var(--radius-small, 0.25rem);
    }

    .gift-form {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-03, 0.5rem);
    }

    .gift-form > cds-button {
      align-self: flex-end;
    }

    /* Finalized Add Gift mockup: 716px dialog and 408px form column. */
    :host([type="custom"]) cds-modal::part(dialog) {
      inline-size: 44.75rem;
      max-inline-size: calc(100vw - var(--cds-spacing-07));
      max-block-size: calc(100dvh - var(--cds-spacing-07));
      border-radius: var(--radius-small);
    }

    :host([type="custom"]) cds-modal-header {
      margin-block-end: 0;
      padding: var(--cds-spacing-10) var(--cds-spacing-05) 0;
    }

    :host([type="custom"]) cds-modal-close-button {
      inset-block-start: var(--cds-spacing-02);
      inset-inline-end: var(--cds-spacing-02);
    }

    :host([type="custom"]) cds-modal-heading,
    :host([type="custom"]) .gift-form {
      max-inline-size: 25.5rem;
      margin-inline: auto;
    }

    :host([type="custom"]) cds-modal-heading {
      padding: 0;
      font-size: var(--cds-heading-04-font-size, 1.5rem);
    }

    :host([type="custom"]) cds-modal-body {
      margin: 0;
      min-block-size: 0;
      padding: var(--cds-spacing-02) var(--cds-spacing-05) var(--cds-spacing-07);
      font-family: var(--font-family-body);
      --cds-field: var(--cds-field-02);
      --cds-label-01-font-size: 0.625rem;
      --cds-body-compact-01-font-size: 0.6875rem;
      --cds-body-01-font-size: 0.6875rem;
    }

    :host([type="custom"]) cds-button::part(button),
    :host([type="custom"]) cds-dropdown::part(trigger-button) {
      border-radius: 0;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.type = "add-gift";
    this.people = [];
    this._personId = "";
    this._saving = false;
    this._errors = {};
  }

  _closeModal() {
    this.open = false;
  }

  _field(name) {
    return this.renderRoot.querySelector(`[name="${name}"]`);
  }

  //Prep for another add gift by voiding all entries
  _resetForm() {
    for (const name of ["gift-name", "gift-link", "quantity", "occasion"]) {
      this._field(name).value = "";
    }
    this._field("person-id").value = "";
    this._field("status").value = "need-to-buy";
    this._personId = "";
    this._errors = {};
  }

//When clicked
  async _submit() {
  //Read everything
    const name = this._field("gift-name").value.trim();
    const link = this._field("gift-link").value.trim();
    const quantity = Number(this._field("quantity").value) || 1;
    const occasion = this._field("occasion").value.trim();
    const status = this._field("status").value;

    //Were things entered
    const errors = {};
    if (!name) errors.name = "Please enter a gift name.";
    if (!this._personId) errors.person = "Please choose who this gift is for.";
    this._errors = errors;
    if (Object.keys(errors).length) return;

    //No more clicks allowed
    this._saving = true;

    try {
    //Send a json out to database
      await apiFetch(`/user/${getUserId()}/gift/person/${this._personId}`, {
            token: getAccessToken(),
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              type: "gift",
              link,
              quantity,
              status: { stage: STAGES[status] ?? status },
              occasion: occasion ? { name: occasion } : undefined,
            }),
          });
    //Success, package sent to backend
      this.dispatchEvent(
        new CustomEvent("gift-added", { bubbles: true, composed: true })
      );
      this._resetForm();
      this.open = false;
    } catch (error) {
    //Rip. It didnt send it for whatever reason.
      this._errors = { general: `Could not add gift: ${error.message}` };
    } finally {
      this._saving = false;
    }
  }

  _submitOnEnter(event) {
    if (
      event.key === "Enter" &&
      !event.defaultPrevented &&
      !event.isComposing &&
      event.target.localName === "cds-text-input"
    ) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }

  // Custom forms own their data and decide when to close the modal.
  _submitCustom(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent("item-submit", {
      detail: { form: event.currentTarget },
      bubbles: true,
      composed: true,
    }));
  }

  _renderGiftFields() {
    return html`
      <cds-text-input
        data-testid="gift-modal-name-input"
        name="gift-name"
        label="Gift Name"
        placeholder="Enter gift name"
        size="lg"
        type="text"
        required
        data-modal-primary-focus
        ?invalid=${Boolean(this._errors.name)}
        invalid-text=${this._errors.name ?? ""}
      ></cds-text-input>

      <cds-text-input
        data-testid="gift-modal-link-input"
        name="gift-link"
        label="Gift Link"
        placeholder="Enter a link to the gift"
        size="lg"
        type="url"
      ></cds-text-input>

      <cds-text-input
        data-testid="gift-modal-quantity-input"
        name="quantity"
        label="Quantity"
        placeholder="Insert Quantity"
        size="lg"
        type="text"
      ></cds-text-input>

      <cds-text-input
        data-testid="gift-modal-occasion-input"
        name="occasion"
        label="Occasion"
        placeholder="Enter the occasion"
        size="lg"
        type="text"
      ></cds-text-input>

      <cds-dropdown
        data-testid="gift-modal-person-dropdown"
        name="person-id"
        title-text="Who is this gift for?"
        label="Choose a person"
        direction="bottom"
        ?invalid="${Boolean(this._errors.person)}"
        invalid-text="${this._errors.person ?? ''}"
        @cds-dropdown-selected="${(e) => {
          this._personId = e.detail.item.value;
          this._errors = { ...this._errors, person: undefined };
        }}"
      >
        ${(this.people ?? []).map(
          (person) => html`
            <cds-dropdown-item data-testid="gift-modal-person-option-${person.id}" value="${person.id}">
              ${person.fullName ?? "Unnamed person"}
            </cds-dropdown-item>
          `
        )}
      </cds-dropdown>

      <cds-radio-button-group
        data-testid="gift-modal-status-group"
        legend-text="Set Status"
        label-position="right"
        orientation="horizontal"
        name="status"
        value="need-to-buy"
      >
        <cds-radio-button
          data-testid="gift-modal-status-need-to-buy-radio"
          value="need-to-buy"
          label-text="Need to buy"
        ></cds-radio-button>

        <cds-radio-button
          data-testid="gift-modal-status-purchased-radio"
          value="purchased"
          label-text="Purchased"
        ></cds-radio-button>
      </cds-radio-button-group>

      ${this._errors.general
        ? html`
            <cds-inline-notification
              data-testid="gift-modal-error-banner"
              kind="error"
              title="Error"
              subtitle=${this._errors.general}
              hide-close-button
              open
            ></cds-inline-notification>
          `
        : ""}
    `;
  }

  render() {
    const custom = this.type === "custom";
    const heading = custom ? this.heading || "Add Item" : "Add Gift";
    const submitLabel = (custom && this.submitLabel) || heading;

    return html`
      <cds-modal
        data-testid="gift-modal-dialog"
        ?open=${this.open}
        aria-label=${heading}
        @cds-modal-closed=${this._closeModal}
      >
        <cds-modal-header>
          <cds-modal-close-button data-testid="gift-modal-close-button"></cds-modal-close-button>
          <cds-modal-heading>${heading}</cds-modal-heading>
        </cds-modal-header>

        <cds-modal-body>
          <form
            class="gift-form"
            data-testid="gift-modal-form"
            @submit=${custom ? this._submitCustom : nothing}
            @keydown=${custom ? this._submitOnEnter : nothing}
          >
            ${custom ? this.fields : this._renderGiftFields()}

            <cds-button
              data-testid="gift-modal-submit-button"
              type="button"
              size=${custom ? "sm" : "lg"}
              kind="primary"
              ?disabled=${!custom && this._saving}
              @click=${custom
                ? (event) => event.currentTarget.closest("form").requestSubmit()
                : this._submit}
            >
              ${!custom && this._saving ? "Adding…" : submitLabel}
              ${iconLoader(Add16, { slot: "icon", "aria-hidden": "true" })}
            </cds-button>
          </form>
        </cds-modal-body>
      </cds-modal>
    `;
  }
}

customElements.define("gift-modal", GiftAddGiftModal);