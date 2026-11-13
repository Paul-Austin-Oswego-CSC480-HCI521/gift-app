
import { LitElement, html, css } from "lit";
import "../gift-wishlist-table/gift-wishlist-table.js";
import { pageContentStyles } from "../../styles/page-content.js";

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const COLOR_NAMES = {
  red: "#e53935",
  orange: "#fb8c00",
  yellow: "#fdd835",
  green: "#43a047",
  blue: "#1e88e5",
  purple: "#8e24aa",
  pink: "#ec407a",
  black: "#212121",
  white: "#ffffff",
  gray: "#9e9e9e",
  grey: "#9e9e9e",
  brown: "#795548",
  teal: "#00897b",
  navy: "#1a237e",
  gold: "#d4af37",
  silver: "#b0bec5",
  beige: "#d6c6a5",
  maroon: "#800000",
};

function displayValue(value) {
  if (value == null || value === "") {
    return "Not provided";
  }

  if (Array.isArray(value)) {
    const parts = value
      .map(displayValue)
      .filter((part) => part !== "Not provided");

    return parts.length ? parts.join(", ") : "Not provided";
  }

  if (typeof value === "object") {
    return displayValue(
      value.value ?? value.label ?? value.name ?? value.text
    );
  }

  return String(value).trim() || "Not provided";
}

function colorTokens(value) {
  if (value == null) return [];

  if (Array.isArray(value)) {
    return value.flatMap(colorTokens);
  }

  if (typeof value === "object") {
    return colorTokens(
      value.value ?? value.label ?? value.name
    );
  }

  return String(value)
    .split(/[,;|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function validColor(token) {
  const lower = token.toLowerCase().trim();

  if (Object.prototype.hasOwnProperty.call(COLOR_NAMES, lower)) {
    return COLOR_NAMES[lower];
  }

  return /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(lower)
    ? lower
    : null;
}

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
        background: var(--card-background, #fcfbf4);
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

      .colors {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .color-item {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
      }

      .swatch {
        display: inline-block;
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 50%;
        border: 1px solid #777;
        flex: none;
      }

      .color-name {
        font-size: 0.8rem;
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

  preferenceValue(...keys) {
  const p = this.person ?? {};

  const sources = [p, p.preferences].filter(
    (source) => source && typeof source === "object"
  );

  for (const source of sources) {
    for (const [name, value] of Object.entries(source)) {
      if (
        keys.some((key) => normalize(key) === normalize(name)) &&
        value != null &&
        value !== ""
      ) {
        return value;
      }
    }
  }

  const attributes = Array.isArray(p.attributes)
    ? p.attributes
    : [];

  for (const attribute of attributes) {
    const name =
      attribute.attribute_name ??
      attribute.attributeName ??
      attribute.name ??
      attribute.key;

    if (keys.some((key) => normalize(key) === normalize(name))) {
      const value =
        attribute.value ??
        attribute.attributeValue ??
        attribute.values;

      if (value != null && value !== "") {
        return value;
      }
    }
  }

  return null;
}

preference(...keys) {
  return displayValue(this.preferenceValue(...keys));
}

  renderColors() {
  const raw = this.preferenceValue(
    "favoriteColors",
    "favorite colors",
    "favoriteColor",
    "colors",
    "color"
  );

  const colors = colorTokens(raw);

  if (!colors.length) {
    return html`<p>Not provided</p>`;
  }

  return html`
    <div class="colors">
      ${colors.map((color) => {
        const swatch = validColor(color);

        return html`
          <span class="color-item">
            ${swatch
              ? html`
                  <span
                    class="swatch"
                    style=${`background-color: ${swatch}`}
                    role="img"
                    aria-label=${color}
                  ></span>
                `
              : ""}
            <span class="color-name">${color}</span>
          </span>
        `;
      })}
    </div>
  `;
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

    
    const items = gifts.map((gift) => {
      const rawStatus = gift.status;

      const stage =
        typeof rawStatus === "string"
          ? rawStatus
          : rawStatus?.stage ??
            rawStatus?.name ??
            rawStatus?.label ??
            rawStatus?.status;

      const status =
        ["purchased", "gifted", "received"].includes(
          String(stage ?? "").toLowerCase()
        )
          ? "Received"
          : "Wanted";

      return {
        ...gift,
        giftName: gift.giftName ?? gift.name ?? "",
        value: gift.value ?? gift.price ?? 0,
        status:
          typeof status === "string" ? status : "Wanted",
      };
    });


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
          <div class="card">
            <h3>Favorite Colors</h3>
            ${this.renderColors()}
          </div>

          <div class="card">
            <h3>Sizes</h3>
            <p>
              ${this.preference(
                "sizes",
                "size",
                "clothingSize"
              )}
            </p>
          </div>

          <div class="card">
            <h3>Interests</h3>
            <p>
              ${this.preference(
                "interests",
                "interest",
                "hobbies"
              )}
            </p>
          </div>

          <div class="card">
            <h3>Dislikes</h3>
            <p>
              ${this.preference(
                "dislikes",
                "dislike"
              )}
            </p>
          </div>
        </div>
      </section>

      
      <section class="wishlist" aria-label="Person gift list">
        <gift-wishlist-table
          .items=${items}
          .listTitle=${`${this.personName}'s list`}
          .addButtonLabel=${"Add to Gift"}
        ></gift-wishlist-table>
      </section>
    `;
  }
}

customElements.define("gift-people-profile", GiftingPeopleProfile);