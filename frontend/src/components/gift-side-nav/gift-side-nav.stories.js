import { html } from "lit";
import "./gift-side-nav.js";
import "../../styles/page-templates.css";

// The app's authenticated navigation: icon + label links, then Add Gift / Add Recipient and
// Settings pinned to the bottom. A composition of cds-side-nav, styled by brand-theme.css and
// page-templates.css.
export default {
  title: "Custom Components/Side Nav",
  render: ({ active }) => html`<gift-side-nav active=${active}></gift-side-nav>`,
  argTypes: {
    active: {
      control: "select",
      options: ["dashboard", "wishlist", "people", "dates", "gifts", "settings"],
    },
  },
  args: { active: "dashboard" },
};

export const Default = {};
export const WishListActive = { args: { active: "wishlist" } };
