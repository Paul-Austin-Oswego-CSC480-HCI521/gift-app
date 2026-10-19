import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/password-input/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/notification/index.js";

export class CreateAccountForm extends LitElement {
  static properties = {
    errorMessage: { type: String, attribute: "error-message" },
    loading: { type: Boolean },
    _errors: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-06, 1.5rem);
    }
    cds-inline-notification {
      max-inline-size: 100%;
    }
    cds-button {
      align-self: flex-start;
    }
  `;

  constructor() {
    super();
    this.errorMessage = "";
    this.loading = false;
    this._errors = {};
  }

  _submit(event) {
    event.preventDefault();
    if (this.loading) return;
    const fields = Object.fromEntries(
      [...this.renderRoot.querySelectorAll("[name]")].map((field) => [
        field.name,
        field,
      ]),
    );
    const firstName = fields.firstName.value.trim();
    const surname = fields.surname.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;
    this._errors = {
      firstName: firstName ? "" : "Enter your first name.",
      surname: surname ? "" : "Enter your last name.",
      email: !email
        ? "Enter your email address."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Enter a valid email address."
          : "",
      password: password ? "" : "Enter a password.",
      confirmPassword: !confirmPassword
        ? "Confirm your password."
        : confirmPassword !== password
          ? "Passwords must match."
          : "",
    };
    const invalid = Object.keys(this._errors).find(
      (name) => this._errors[name],
    );
    if (invalid) {
      fields[invalid].focus();
      return;
    }
    // Backend integration owns password policy and persistence. Never store credentials here.
    this.dispatchEvent(
      new CustomEvent("create-account-submit", {
        detail: { firstName, surname, email, password },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleKeydown(event) {
    if (
      event.key === "Enter" &&
      !event.isComposing &&
      event.composedPath()[0]?.tagName === "INPUT"
    )
      this._submit(event);
  }

  async firstUpdated() {
    // Carbon's cds-password-input doesn't set `for` on its internal <label>,
    // so its <input> has no accessible name. Set aria-label directly until
    // upstream fixes it (carbon-design-system/carbon password-input.ts).
    const passwordInputs = this.renderRoot.querySelectorAll(
      "cds-password-input",
    );
    await Promise.all(
      [...passwordInputs].map(async (passwordInput) => {
        await passwordInput.updateComplete;
        passwordInput.shadowRoot
          ?.querySelector("input")
          ?.setAttribute("aria-label", passwordInput.label);
      }),
    );
  }

  render() {
    return html`
      <form
        aria-label="Create account"
        aria-busy=${this.loading}
        novalidate
        @submit=${this._submit}
        @keydown=${this._handleKeydown}
      >
        ${[
          ["firstName", "First name", "given-name", "text"],
          ["surname", "Last name", "family-name", "text"],
          ["email", "Email", "email", "email"],
        ].map(
          ([name, label, autocomplete, type]) => html`
            <cds-text-input
              name=${name}
              label=${label}
              autocomplete=${autocomplete}
              type=${type}
              required
              ?disabled=${this.loading}
              ?invalid=${Boolean(this._errors[name])}
              invalid-text=${this._errors[name] || ""}
            ></cds-text-input>
          `,
        )}
        ${[
          ["password", "Password"],
          ["confirmPassword", "Confirm password"],
        ].map(
          ([name, label]) => html`
            <cds-password-input
              name=${name}
              id=${name}
              label=${label}
              autocomplete="new-password"
              required
              ?disabled=${this.loading}
              ?invalid=${Boolean(this._errors[name])}
              invalid-text=${this._errors[name] || ""}
            ></cds-password-input>
          `,
        )}
        ${this.errorMessage
          ? html`
              <cds-inline-notification
                kind="error"
                title="Unable to create account"
                subtitle=${this.errorMessage}
                hide-close-button
              ></cds-inline-notification>
            `
          : nothing}
        <cds-button
          type="button"
          kind="primary"
          ?disabled=${this.loading}
          @click=${this._submit}
          >${this.loading ? "Creating account…" : "Create account"}</cds-button
        >
      </form>
    `;
  }
}
customElements.define("gift-create-account-form", CreateAccountForm);
