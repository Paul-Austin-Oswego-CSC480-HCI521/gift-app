import "@carbon/web-components/es/components/search/index.js";
import { html } from "lit";

// Search (Gifts frame, Search - Default 1324:12020): 48px field on --cds-field-01 with a
// --cds-border-strong bottom border, 16px magnifier and --cds-text-placeholder text.
export default {
  title: "Carbon Components/Search",
  render: ({ placeholder, size }) => html`
    <cds-search label-text="Search" placeholder=${placeholder} size=${size} close-button-label-text="Clear search input"></cds-search>
  `,
  argTypes: {
    placeholder: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: { placeholder: "Search for gift", size: "lg" },
};

export const Default = {};
