import "./auth/require-auth.js";
import { LitElement, html } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import { apiFetch } from "./api/client.js";
import './components/gift-side-nav/gift-side-nav.js';
import "./components/gift-nav-header/gift-nav-header.js";
import "./styles/brand-theme.css";
import "./styles/carbon-shape-overrides.js";
import "./styles/carbon-font-overrides.js";
import { getAccessToken, getUserId, clearAccessToken } from "./auth/token-store.js";
import "./components/gift-add-gift-modal/gift-add-gift-modal.js";


export class GiftDashboard extends LitElement {
  static properties = {
    people: { attribute: false },
    showDetails: { state: true },
  };

  constructor() {
    super();
    this.people = [];
    this.showDetails = false;
  }

  createRenderRoot() {
    return this;
  }

  checkbox(person, gift) {
    return html`
      <cds-checkbox
        label-text=${gift.name ?? "Untitled gift"}
        @cds-checkbox-changed=${(event) => {
          this.dispatchEvent(new CustomEvent("gift-selection-change", {
            detail: {
              person,
              gift,
              checked: event.currentTarget.checked,
            },
            bubbles: true,
            composed: true,
          }));
        }}
      ></cds-checkbox>
    `;
  }

  topCard(title, stage) {
    const gifts = (this.people ?? []).flatMap(person =>
      (person.gifts ?? [])
        .filter(gift =>
          String(gift.status?.stage ?? "").trim().toLowerCase() === stage
        )
        .map(gift => html`
          <li>${this.checkbox(person, gift)}</li>
        `)
    );

    return html`
      <section class="dashboard-card">
        <header class="card-header">
          <h2>${title}</h2>
          <cds-button kind="ghost" size="sm" @click=${() => {
            this.dispatchEvent(new CustomEvent("gift-list-view-all", {
              detail: { section: stage },
              bubbles: true,
              composed: true,
            }));
          }}>View All →</cds-button>
        </header>

        <ul class="gift-list">${gifts}</ul>
      </section>
    `;
  }

  giftDetails(person, gift) {
    const fields = [
      ["Type", gift.type],
      ["Status", gift.status?.stage],
      ["Occasion", gift.occasion?.name],
      ["Occasion date", gift.occasion?.date],
      ["Purchase date", gift.purchaseDate],
    ];

    return html`
      <li>
        ${this.checkbox(person, gift)}
        <dl class="gift-details">
          ${fields.map(([label, value]) => html`
            <div><dt>${label}</dt><dd>${value ?? "—"}</dd></div>
          `)}
        </dl>
      </li>
    `;
  }

  personRow(person) {
    const details = this.showDetails
      ? html`
          <ul class="gift-list person-gifts">
            ${(person.gifts ?? []).map(gift =>
              this.giftDetails(person, gift)
            )}
          </ul>
        `
      : "";

    return html`
      <li>
        <p class="person-name">
          ${person.fullName ?? "Unnamed person"}
        </p>
        ${details}
      </li>
    `;
  }

  render() {
    const people = this.people ?? [];
    const visible = this.showDetails ? people : people.slice(0, 6);

    return html`
      <div class="dashboard-content">
        <h1>Welcome!</h1>

        <div class="gift-grid">
          ${this.topCard("My Wish List", "gifted")}
          ${this.topCard("Still Need to Buy", "updated")}
        </div>

        <section class="dashboard-card people-card">
          <header class="card-header">
            <h2>People</h2>
            <cds-button
              kind="ghost"
              size="sm"
              aria-expanded=${String(this.showDetails)}
              aria-controls="people-items"
              @click=${() => {
                this.showDetails = !this.showDetails;
              }}
            >${this.showDetails ? "Show Less" : "View All →"}</cds-button>
          </header>

          <ul id="people-items" class="people-list">
            ${visible.map(person => this.personRow(person))}
          </ul>

          ${people.length ? "" : html`
            <p class="empty-message">No people yet.</p>
          `}
        </section>
      </div>
    `;
  }
}

if (!customElements.get("gift-dashboard")) {
  customElements.define("gift-dashboard", GiftDashboard);
}

const dashboard = document.querySelector("gift-dashboard");
const status = document.querySelector("#status");
const reloadButton = document.querySelector("#reload-button");
const addGiftButton = document.getElementById("add-gift-button");
const addGiftModal = document.getElementById("add-gift-modal");

addGiftButton?.addEventListener("click", () => {
  addGiftModal.open = true;
});

async function loadData() {
  reloadButton.disabled = true;
  status.textContent = "Loading…";

  try {
    const user = await apiFetch("/user/1", { token: getAccessToken() });
    dashboard.people = user.people ?? [];
    status.textContent = "Data loaded successfully.";
  } catch (error) {
  if (error.status === 401) {
        clearAccessToken();
        window.location.replace("./index.html");
        return;
      }
    status.textContent = `Could not load data: ${error.message}`;
  } finally {
    reloadButton.disabled = false;
  }
}

if (getAccessToken() && dashboard && status && reloadButton) {
  reloadButton.addEventListener("click", loadData);
  loadData();
}
