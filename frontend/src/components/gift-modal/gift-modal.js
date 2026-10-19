import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/radio-button/index.js";
import "@carbon/web-components/es/components/button/index.js";

// One generic modal shell; `type` picks which modal it is. Add a new modal by adding an entry
// to MODALS (heading, submit label, and a method that renders its fields) and a story.
const MODALS = {
    "add-gift": { heading: "Add Gift", submitLabel: "Add Gift", fields: "_addGiftFields" },
};
const DEFAULT_TYPE = "add-gift";

export class GiftModal extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
        type: { type: String, reflect: true },
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
          gap: var(--cds-spacing-05, 1rem);
        }

        cds-button {
          align-self: flex-end;
        }
    `;

    constructor() {
        super();
        this.open = false;
        this.type = DEFAULT_TYPE;
    }
//  Generic carbon block
//     <div style="width: 300px;">
//   <cds-text-input helper-text="Helper text" invalid-text="Error message goes here" label="Label text" max-count="100" placeholder="Placeholder text" size="md" type="text" warn-text="Warning message that is really long can wrap to more lines but should not be excessively long.">
    
//   </cds-text-input>
// </div> 

  _closeModal() {
          this.open = false;
      }

  _addGiftFields() {
    return html`
            <cds-text-input
              name="gift-name"
              label="Gift Name"
              placeholder="Enter gift name"
              size="lg"
              type="text"
              required
              data-modal-primary-focus
            >
            </cds-text-input>

            <cds-text-input
              name="gift-link"
              label="Gift Link"
              placeholder="Enter a link to the gift"
              size="lg"
              type="url"
            >
            </cds-text-input>

            <cds-text-input
              name="quantity"
              label="Quantity"
              placeholder="Insert Quantity"
              size="lg"
              type="text"
            >
            </cds-text-input>

            <cds-text-input
              name="occasion"
              label="Occasion"
              placeholder="Enter the occasion"
              size="lg"
              type="text"
            >
            </cds-text-input>

            <cds-dropdown
              name="person-id"
              title-text="Who is this gift for?"
              label="Choose a person"
              direction="bottom"
            >
              <cds-dropdown-item value="example-person">
                Example Recipient
              </cds-dropdown-item>
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
    `;
  }

  render() {
    const modal = MODALS[this.type] ?? MODALS[DEFAULT_TYPE];
    return html`
      <cds-modal
        ?open=${this.open}
        size="sm"
        aria-label=${modal.heading}
        @cds-modal-closed=${this._closeModal}
      >
        <cds-modal-header>
          <cds-modal-close-button></cds-modal-close-button>
          <cds-modal-heading>${modal.heading}</cds-modal-heading>
        </cds-modal-header>

        <cds-modal-body>
          <form class="gift-form">
            ${this[modal.fields]()}

            <cds-button type="button" kind="primary">
              ${modal.submitLabel}
              <svg
                slot="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2h-7z"
                ></path>
              </svg>
            </cds-button>
          </form>
        </cds-modal-body>
      </cds-modal>
    `;
  }
}

customElements.define("gift-modal", GiftModal);
