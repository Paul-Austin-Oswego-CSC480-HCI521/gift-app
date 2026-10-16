import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/radio-button/index.js";
import "@carbon/web-components/es/components/button/index.js";

export class GiftAddGiftModal extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
    };

    static styles = css`
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
    }
//  Generic carbon block
//     <div style="width: 300px;">
//   <cds-text-input helper-text="Helper text" invalid-text="Error message goes here" label="Label text" max-count="100" placeholder="Placeholder text" size="md" type="text" warn-text="Warning message that is really long can wrap to more lines but should not be excessively long.">
    
//   </cds-text-input>
// </div> 

  render() {
    return html`
      <cds-modal ?open=${this.open} aria-label="Add Gift">
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

            <cds-button type="button" kind="primary">
              Add Gift
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

customElements.define("gift-add-gift-modal", GiftAddGiftModal);

        