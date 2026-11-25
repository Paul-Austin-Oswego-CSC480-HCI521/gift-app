import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/select/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "../gift-tile/gift-tile.js";
import { pageContentStyles } from "../../styles/page-content.js";
import { notificationTheme } from "../../styles/notification-theme.js";

const CLOTHING_SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL"];
const SHOE_SIZE_OPTIONS = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];

export class GiftQuickPreferences extends LitElement {
  static properties = {
    saving: { type: Boolean },
    error: { type: String },
  };

  static styles = [
    notificationTheme,
    pageContentStyles,
    css`
      form {
        display: grid;
        gap: var(--cds-spacing-05);
        justify-items: start;
      }

      .preferences-grid {
        inline-size: 100%;
        box-sizing: border-box;
      }

      .intro {
        display: flex;
        flex-direction: column;
        gap: var(--cds-spacing-02);
      }

      .intro p {
        margin: 0;
      }

      .preferences-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-areas:
          "basic likes"
          "basic dislikes"
          "interests interests";
        gap: var(--cds-spacing-06, 1.5rem);
        padding: 2px 8px 8px 2px;
      }

      gift-tile {
        inline-size: 100%;
        max-inline-size: none;
      }

      .basic-information {
        grid-area: basic;
      }

      .basic-information-fields {
        display: flex;
        flex-direction: column;
        gap: var(--cds-spacing-04, 0.75rem);
      }

      .likes {
        grid-area: likes;
      }

      .dislikes {
        grid-area: dislikes;
      }

      .interests {
        grid-area: interests;
      }

      h2 {
        margin: 0;
        padding-block-end: var(--cds-spacing-03, 0.5rem);
        border-block-end: 1px solid var(--cds-border-strong);
        font-family: var(--font-family-heading);
        font-size: 1rem;
        line-height: 1.5;
        font-weight: 400;
      }

      @media (max-width: 42rem) {
        .preferences-grid {
          grid-template-columns: 1fr;
          grid-template-areas:
            "basic"
            "likes"
            "dislikes"
            "interests";
        }
      }
    `,
  ];

  save(event) {
    event.preventDefault();
    if (this.saving) return;
    const detail = Object.fromEntries(
      Array.from(event.currentTarget.querySelectorAll("cds-text-input, cds-select, cds-textarea"), field => [
        field.getAttribute("name"),
        field.value ?? "",
      ])
    );
    this.dispatchEvent(new CustomEvent("preferences-save", { detail, bubbles: true, composed: true }));
  }

  renderSelect(label, name, options) {
    return html`
      <cds-select data-testid="quick-preferences-${name}-select" label-text=${label} name=${name} placeholder="Choose an option">
        ${options.map(
          (option) => html`<cds-select-item value=${option}>${option}</cds-select-item>`
        )}
      </cds-select>
    `;
  }

  render() {
    return html`
      <header class="intro">
        <h1 data-testid="quick-preferences-heading">Gift Preferences: Quick Set Up</h1>
        <p>
          Here is a quick way to fill out your basic preferences. You can add
          more details now or later, if you’d like.
        </p>
      </header>

      <form data-testid="quick-preferences-form" @submit=${this.save}>
        <div class="preferences-grid">
          <gift-tile type="section" data-testid="quick-preferences-basic-information-section" class="basic-information">
            <h2 slot="title">Basic Information</h2>

            <div class="basic-information-fields">
              <cds-text-input
                data-testid="quick-preferences-favorite-color-input"
                label="Favorite Colors"
                name="favorite-color"
              ></cds-text-input>
              ${this.renderSelect("Shirt Size", "shirt-size", CLOTHING_SIZE_OPTIONS)}
              ${this.renderSelect("Pant Size", "pant-size", CLOTHING_SIZE_OPTIONS)}
              ${this.renderSelect("Shoe Size", "shoe-size", SHOE_SIZE_OPTIONS)}
              ${this.renderSelect("Jacket Size", "jacket-size", CLOTHING_SIZE_OPTIONS)}
            </div>
          </gift-tile>

          <gift-tile type="section" data-testid="quick-preferences-likes-section" class="likes">
            <h2 slot="title">Likes</h2>

            <cds-textarea
              data-testid="quick-preferences-likes-textarea"
              label="Things you'd like to receive"
              name="likes"
              placeholder="Enter your likes here"
              rows="5"
              enable-counter
              max-count="100"
            ></cds-textarea>
          </gift-tile>

          <gift-tile type="section" data-testid="quick-preferences-dislikes-section" class="dislikes">
            <h2 slot="title">Dislikes</h2>

            <cds-textarea
              data-testid="quick-preferences-dislikes-textarea"
              label="Things you would prefer not to receive"
              name="dislikes"
              placeholder="Enter your dislikes here"
              rows="5"
              enable-counter
              max-count="100"
            ></cds-textarea>
          </gift-tile>

          <gift-tile type="section" data-testid="quick-preferences-interests-section" class="interests">
            <h2 slot="title">Interests</h2>

            <cds-textarea
              data-testid="quick-preferences-interests-textarea"
              label="Placeholder text"
              name="interests"
              placeholder="Enter your interests here"
              rows="5"
              enable-counter
              max-count="100"
            ></cds-textarea>
          </gift-tile>
        </div>
        ${this.error ? html`
          <cds-inline-notification kind="error" title="Couldn’t save preferences" subtitle=${this.error} hide-close-button></cds-inline-notification>
        ` : ""}
        <cds-button
          type="button"
          data-testid="quick-preferences-save-button"
          ?disabled=${this.saving}
          @click=${() => this.renderRoot.querySelector("form").requestSubmit()}
        >${this.saving ? "Saving…" : "Save Preferences"}</cds-button>
      </form>
    `;
  }
}

customElements.define("gift-quick-preferences", GiftQuickPreferences);
