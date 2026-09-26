import { LitElement, css, html } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import { apiFetch } from "../api/client.js";

export class DatabaseStatus extends LitElement {
  static properties = {
    checking: { state: true },
    message: { state: true },
  };

  static styles = css`
    :host { display: block; padding: 1rem; }
    h2 { font-size: 1.25rem; margin: 0 0 1rem; }
    p { margin: 1rem 0 0; }
  `;

  constructor() {
    super();
    this.checking = false;
    this.message = "Not checked yet.";
  }

  async checkDatabase() {
    if (this.checking) return;
    this.checking = true;
    this.message = "Checking database…";
    try {
      const result = await apiFetch("/api/db/health", {
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      });
      this.message = result.status === "UP"
        ? "Database connected."
        : "Database check failed. Check the backend and database configuration.";
    } catch {
      this.message = "Database check failed. Check the backend and database configuration.";
    } finally {
      this.checking = false;
    }
  }

  render() {
    return html`
      <section aria-labelledby="database-heading">
        <h2 id="database-heading">Database connection (development)</h2>
        <cds-button ?disabled=${this.checking} @click=${this.checkDatabase}>
          ${this.checking ? "Checking…" : "Check database"}
        </cds-button>
        <p role="status">${this.message}</p>
      </section>
    `;
  }
}

customElements.define("gift-database-status", DatabaseStatus);
