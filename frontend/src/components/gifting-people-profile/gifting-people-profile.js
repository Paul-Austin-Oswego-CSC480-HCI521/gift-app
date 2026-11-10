
import { LitElement, html, css } from "lit";
import "../gift-wishlist-table/gift-wishlist-table.js";
import { pageContentStyles } from "../../styles/page-content.js";

export class GiftingPeopleProfile extends LitElement {
  static properties = {
    person: { attribute: false },
    loading: { type: Boolean },
    error: { type: String },
  };

  static styles = [
    pageContentStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }

      .breadcrumb {
        font-size: 0.875rem;
        margin-bottom: 0.75rem;
      }

      .breadcrumb a {
        color: var(--cds-link-primary);
      }

      h1 {
        margin-bottom: 0.25rem;
      }

      .relationship {
        margin: 0 0 1.5rem;
      }

      .preferences {
        background: #e8f4ed;
        border-radius: 10px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
      }

      .preferences h2 {
        margin: 0 0 1rem;
        font-size: 1rem;
      }

      .cards {
        display: grid;
        grid-template-columns:
          repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .card {
        background: #fff;
        border-radius: 8px;
        padding: 1rem;
        overflow-wrap: anywhere;
      }

      .card h3 {
        margin: 0 0 0.5rem;
        font-size: 0.8rem;
      }

      .card p {
        margin: 0;
      }

      .wishlist h2 {
        margin: 0 0 1rem;
      }

      .note {
        font-size: 0.8rem;
        color: var(--cds-text-secondary);
      }
    `,
  ];

  constructor() {
    super();
    this.person = null;
    this.loading = true;
    this.error = "";
  }

  get personName() {
    const p = this.person ?? {};

    return (
      p.fullName ||
      [p.firstName, p.lastName]
        .filter(Boolean)
        .join(" ") ||
      p.name ||
      "Person"
    );
  }

  preference(...keys) {
    const p = this.person ?? {};

    const attributes = Array.isArray(p.attributes)
      ? p.attributes
      : [];

    const normalize = (value) =>
      String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z]/g, "");

    for (const key of keys) {
      const direct = p[key];

      if (direct != null && direct !== "") {
        return Array.isArray(direct)
          ? direct.join(", ")
          : String(direct);
      }

      const match = attributes.find(
        (a) =>
          normalize(
            a.attribute_name ??
              a.attributeName ??
              a.name
          ) === normalize(key)
      );

      if (match?.value != null && match.value !== "") {
        return String(match.value);
      }
    }

    return "Not provided";
  }

  render() {
    if (this.loading) {
      return html`
        <p role="status">Loading person profile…</p>
      `;
    }

    if (this.error) {
      return html`
        <p role="alert">
          ${this.error}
          <a href="/people">Back to People</a>
        </p>
      `;
    }

    const gifts = Array.isArray(this.person?.gifts)
      ? this.person.gifts
      : [];

    const items = gifts.map((gift) => ({
      ...gift,
      giftName: gift.giftName ?? gift.name ?? "",
      value: gift.value ?? gift.price ?? 0,
    }));

    return html`
      <nav
        class="breadcrumb"
        aria-label="Breadcrumb"
      >
        <a href="/people">People</a>
        / ${this.personName}
      </nav>

      <h1>${this.personName}</h1>

      <p class="relationship">
        Relationship:
        ${this.preference("relationship")}
      </p>

      <section
        class="preferences"
        aria-label="Person preferences"
      >
        <h2>
          ${this.personName}'s Preferences
        </h2>

        <div class="cards">
          ${[
            [
              "Favorite Colors",
              this.preference(
                "favoriteColors",
                "favorite colors",
                "colors"
              ),
            ],
            [
              "Sizes",
              this.preference("sizes", "size"),
            ],
            [
              "Interests",
              this.preference(
                "interests",
                "interest"
              ),
            ],
            [
              "Dislikes",
              this.preference(
                "dislikes",
                "dislike"
              ),
            ],
          ].map(
            ([label, value]) => html`
              <div class="card">
                <h3>${label}</h3>
                <p>${value}</p>
              </div>
            `
          )}
        </div>
      </section>

      <section
        class="wishlist"
        aria-label="Person gift list"
      >
        <h2>${this.personName}'s list</h2>

        <gift-wishlist-table
          .items=${items}
        ></gift-wishlist-table>

      </section>
    `;
  }
}

customElements.define(
  "gifting-people-profile",
  GiftingPeopleProfile
);
