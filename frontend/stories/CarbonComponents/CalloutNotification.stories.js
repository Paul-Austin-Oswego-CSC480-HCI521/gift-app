import "@carbon/web-components/es/components/notification/index.js";
import { html } from "lit";

// Unlike cds-inline-notification, it has no close button by default, which suits a
// banner that should stay visible for the whole page.
export default {
  title: "Carbon Components/Callout Notification",
  render: ({ kind, title, subtitle }) => html`
    <cds-callout-notification kind=${kind} low-contrast title=${title}>
      <span slot="subtitle">${subtitle}</span>
    </cds-callout-notification>
  `,
  argTypes: {
    kind: {
      control: "select",
      options: ["error", "success", "warning", "info", "warning-alt"],
    },
    title: { control: "text" },
    subtitle: { control: "text" },
  },
  args: {
    kind: "warning",
    title: "Lorem ipsum dolor sit amet",
    subtitle: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  },
};

export const Default = {};
