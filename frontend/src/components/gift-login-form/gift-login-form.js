import { LitElement, html, css, nothing } from "lit";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/password-input/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/notification/index.js";

export class LoginForm extends LitElement {
  static properties = {
    errorMessage: { type: String, attribute: "error-message" },
    loading: { type: Boolean },
    _emailError: { state: true },
    _passwordError: { state: true },
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
    this._emailError = "";
    this._passwordError = "";
  }

  _submit(event) {
    event.preventDefault();
    if (this.loading) return;

    const emailInput = this.renderRoot.querySelector("cds-text-input");
    const passwordInput = this.renderRoot.querySelector("cds-password-input");
    const rememberMe = this.renderRoot.querySelector("cds-checkbox").checked;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    this._emailError = !email
      ? "Enter your email address."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Enter a valid email address."
        : "";
    this._passwordError = password ? "" : "Enter your password.";
    if (this._emailError || this._passwordError) {
      (this._emailError ? emailInput : passwordInput).focus();
      return;
    }

    // The page owns authentication; this component only validates and emits data.
    this.dispatchEvent(
      new CustomEvent("login-submit", {
        detail: { email, password, rememberMe },
        bubbles: true,
        composed: true,
      }),
    );
  }

  async firstUpdated() {
    // Carbon's cds-password-input doesn't set `for` on its internal <label>,
    // so its <input> has no accessible name. Set aria-label directly until
    // upstream fixes it (carbon-design-system/carbon password-input.ts).
    const passwordInput = this.renderRoot.querySelector("cds-password-input");
    await passwordInput?.updateComplete;
    passwordInput?.shadowRoot
      ?.querySelector("input")
      ?.setAttribute("aria-label", passwordInput.label);
  }

  _handleKeydown(event) {
    // Carbon inputs have their own shadow roots, so handle Enter explicitly.
    if (
      event.key === "Enter" &&
      !event.isComposing &&
      event.composedPath()[0]?.tagName === "INPUT"
    ) {
      this._submit(event);
    }
  }

  render() {
    return html`
      <form
        aria-label="Log in"
        aria-busy=${this.loading}
        novalidate
        @submit=${this._submit}
        @keydown=${this._handleKeydown}
      >
        <cds-text-input
          name="email"
          type="email"
          autocomplete="username"
          required
          label="Email"
          ?disabled=${this.loading}
          ?invalid=${Boolean(this._emailError)}
          invalid-text=${this._emailError}
        >
        </cds-text-input>
        <cds-password-input
          name="password"
          id="password"
          autocomplete="current-password"
          required
          label="Password"
          ?disabled=${this.loading}
          ?invalid=${Boolean(this._passwordError)}
          invalid-text=${this._passwordError}
        >
        </cds-password-input>
        <cds-checkbox name="remember-me" label-text="Remember me" ?disabled=${this.loading}>
        </cds-checkbox>
        ${this.errorMessage
          ? html`
              <cds-inline-notification
                kind="error"
                title="Unable to log in"
                subtitle=${this.errorMessage}
                hide-close-button
              >
              </cds-inline-notification>
            `
          : nothing}
        <cds-button
          type="button"
          kind="primary"
          ?disabled=${this.loading}
          @click=${this._submit}
          >${this.loading ? "Logging in…" : "Log in"}</cds-button
        >
      </form>
    `;
  }
}

customElements.define("gift-login-form", LoginForm);
