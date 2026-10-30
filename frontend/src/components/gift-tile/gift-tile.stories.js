import { html } from "lit";
import { expect, fn } from "storybook/test";
import "./gift-tile.js";

// Figma typography, applied to slotted content here; the tile itself is only a container.
const title = "font-family: var(--font-family-heading); font-size: 1.625rem; color: var(--card-heading);";
const description = "font-family: var(--font-family-body); font-size: 0.9375rem;";
const metric = "font-family: var(--font-family-heading); font-size: 2rem;";
const name = "font-family: var(--font-family-heading); font-size: 1.5rem; overflow-wrap: anywhere;";
const label = "font-family: var(--font-family-body); font-size: 0.75rem;";

export default {
  title: "Custom Components/Gift Tile",
  argTypes: { onGiftTileAdd: { table: { disable: true } } },
};

export const Default = {
  render: () => html`
    <gift-tile>
      <span slot="title" style="${title}">Card title</span>
      <span slot="description" style="${description}">Supporting description</span>
    </gift-tile>
  `,
};

export const Clickable = {
  render: () => html`
    <gift-tile href="#">
      <span slot="title" style="${title}">Card title</span>
      <span slot="description" style="${description}">Supporting description</span>
    </gift-tile>
  `,
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector("gift-tile");
    await tile.updateComplete;
    const clickableTile = tile.shadowRoot.querySelector("cds-clickable-tile");
    expect(clickableTile).toHaveAttribute("href", "#");
    expect(clickableTile).toHaveAttribute("link-role", "link");
  },
};

export const Section = {
  render: () => html`
    <gift-tile type="section">
      <span slot="title" style="${title}">Section title</span>
      <span slot="description" style="${description}">Section description</span>
    </gift-tile>
  `,
};

export const Metric = {
  render: () => html`
    <gift-tile type="metric" href="#">
      <span slot="title" style="${title}">Dates in next 30 days</span>
      <span slot="metric" style="${metric}">4</span>
      <span style="${description}">2 birthdays, 1 holiday, 1 other</span>
    </gift-tile>
  `,
};

export const Preference = {
  render: () => html`
    <gift-tile type="preference" href="#">
      <span style="${label}">Favorite Colors</span>
      <span style="${description}">Add preferences</span>
    </gift-tile>
  `,
};

export const Person = {
  render: () => html`<gift-tile type="person" href="#"><span style="${name}">River</span></gift-tile>`,
};

export const PersonLongName = {
  render: () => html`
    <gift-tile type="person" href="#"><span style="${name}">Maximilian Alexander Montgomery-Fitzgerald</span></gift-tile>
  `,
};

export const Add = {
  render: ({ onGiftTileAdd }) => html`
    <gift-tile type="add" add-label="Add person" @gift-tile-add=${onGiftTileAdd}></gift-tile>
  `,
  args: { onGiftTileAdd: fn() },
};
