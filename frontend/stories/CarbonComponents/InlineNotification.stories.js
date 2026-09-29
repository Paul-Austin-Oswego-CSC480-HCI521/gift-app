import "@carbon/web-components/es/components/notification/index.js";
import { html } from "lit";

export default {
  title: "Carbon Components/Inline Notification",
  render: ({ kind, title, subtitle }) =>
    html`<cds-inline-notification kind=${kind} title=${title} subtitle=${subtitle}></cds-inline-notification>`,
  argTypes: {
    kind: {
      control: "select",
      options: ["error", "success", "warning", "info", "warning-alt"],
    },
    title: { control: "text" },
    subtitle: { control: "text" },
  },
  args: {
    kind: "info",
    title: "Lorem ipsum dolor sit amet",
    subtitle: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
  },
};

export const Info = {};

export const Error = {
  args: { kind: "error", title: "Error lorem" },
};

export const Success = {
  args: { kind: "success", title: "Success lorem" },
};

export const Warning = {
  args: { kind: "warning", title: "Warning lorem" },
};
