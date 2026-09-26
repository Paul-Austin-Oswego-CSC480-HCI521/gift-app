import { LitElement, css, html } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import { apiFetch } from "../../api/client.js";

export class BackendStatus extends LitElement {
  static properties = {
    checking: { state: true },
    message: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      padding: 0 20px;
    }

    section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    h2,
    p {
      margin: 0;
    }
  `;

  constructor() {
    super();
    this.checking = false;
    this.message = "Not checked yet.";
  }

  async checkBackend() {
    this.checking = true;
    this.message = "Checking backend...";

    try {
      const result = await apiFetch("/api/ping");
      this.message = `Backend response: ${JSON.stringify(result)}`;
    } catch (error) {
      this.message = `Backend check failed: ${error.message}`;
    } finally {
      this.checking = false;
    }
  }

  render() {
    return html`
      <section aria-labelledby="backend-status-heading">
        <h2 id="backend-status-heading">Backend connection</h2>
        <cds-button ?disabled=${this.checking} @click=${this.checkBackend}>
          ${this.checking ? "Checking..." : "Check backend"}
        </cds-button>
        <p role="status" aria-live="polite">${this.message}</p>
      </section>
    `;
  }
}

customElements.define("gift-backend-status", BackendStatus);
