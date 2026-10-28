//Note. USER_ID is hardcoded. Auth is storing the current users user-id, I just did not
//bother with getting it. This is just a hardcoded bandaid for demo. Similarly, every gift currently has
//gift type as "Gift". This would need to be changed to something dynamic, otherwise its redundant.

import { LitElement, html, css } from "lit";
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
import { getAccessToken } from "../../../auth/token-store.js";

const USER_ID = 1;

const STAGES = {
  "need-to-buy": "updated",
  purchased: "purchased",
};

export class GiftAddGiftModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    people: { attribute: false },
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

    cds-button {
      align-self: flex-end;
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
      await apiFetch(`/user/${USER_ID}/gift/person/${this._personId}`, {
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

  render() {
    return html`
      <cds-modal
        ?open=${this.open}
        aria-label="Add Gift"
        @cds-modal-closed=${this._closeModal}
      >
        <cds-modal-header>
          <cds-modal-close-button></cds-modal-close-button>
          <cds-modal-heading>Add Gift</cds-modal-heading>
        </cds-modal-header>

        <cds-modal-body>
          <form class="gift-form">
            <cds-text-input
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
              name="gift-link"
              label="Gift Link"
              placeholder="Enter a link to the gift"
              size="lg"
              type="url"
            ></cds-text-input>

            <cds-text-input
              name="quantity"
              label="Quantity"
              placeholder="Insert Quantity"
              size="lg"
              type="text"
            ></cds-text-input>

            <cds-text-input
              name="occasion"
              label="Occasion"
              placeholder="Enter the occasion"
              size="lg"
              type="text"
            ></cds-text-input>

            <cds-dropdown
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
                  <cds-dropdown-item value="${person.id}">
                    ${person.fullName ?? "Unnamed person"}
                  </cds-dropdown-item>
                `
              )}
            </cds-dropdown>

            <cds-radio-button-group
              legend-text="Set Status"
              label-position="right"
              orientation="horizontal"
              name="status"
              value="need-to-buy"
            >
              <cds-radio-button
                value="need-to-buy"
                label-text="Need to buy"
              ></cds-radio-button>

              <cds-radio-button
                value="purchased"
                label-text="Purchased"
              ></cds-radio-button>
            </cds-radio-button-group>

            ${this._errors.general
              ? html`
                  <cds-inline-notification
                    kind="error"
                    title="Error"
                    subtitle=${this._errors.general}
                    hide-close-button
                    open
                  ></cds-inline-notification>
                `
              : ""}

            <cds-button
              type="button"
              kind="primary"
              ?disabled=${this._saving}
              @click=${this._submit}
            >
              ${this._saving ? "Adding…" : "Add Gift"}
              <svg
                slot="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2h-7z"></path>
              </svg>
            </cds-button>
          </form>
        </cds-modal-body>
      </cds-modal>
    `;
  }
}

customElements.define("gift-modal", GiftAddGiftModal);