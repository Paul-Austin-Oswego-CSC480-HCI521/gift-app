import { css } from "lit";

// Light-surface notifications for components that render cds-*-notification inside their own
// shadow root. brand-theme.css has the same rule for notifications in the page's light DOM, but a
// descendant selector there cannot cross a shadow boundary, so each such component adds this to
// its `static styles`. Keep the two in sync; see the note above the rule in brand-theme.css for
// why (the default green surface made the status icons fail contrast) and for the contrast
// figures. Light theme only: the dark theme's notifications are already on a light surface.
export const notificationTheme = css`
  cds-inline-notification,
  cds-toast-notification,
  cds-actionable-notification,
  cds-callout-notification {
    --cds-text-inverse: var(--cds-text-primary);
    --cds-icon-inverse: var(--cds-icon-primary);
    --cds-link-inverse: var(--cds-link-primary);
    --cds-support-error-inverse: var(--cds-support-error);
    --cds-support-info-inverse: var(--cds-support-info);
    --cds-support-success-inverse: #1e8a22;
    --cds-support-warning-inverse: #8a6a3a;
  }
  cds-inline-notification[kind="error"],
  cds-toast-notification[kind="error"],
  cds-actionable-notification[kind="error"],
  cds-callout-notification[kind="error"] {
    --cds-background-inverse: var(--cds-notification-background-error, #fff1f1);
  }
  cds-inline-notification[kind="info"],
  cds-toast-notification[kind="info"],
  cds-actionable-notification[kind="info"],
  cds-callout-notification[kind="info"] {
    --cds-background-inverse: var(--cds-notification-background-info, #edf5ff);
  }
  cds-inline-notification[kind="success"],
  cds-toast-notification[kind="success"],
  cds-actionable-notification[kind="success"],
  cds-callout-notification[kind="success"] {
    --cds-background-inverse: var(--cds-notification-background-success, #defbe6);
  }
  cds-inline-notification[kind="warning"],
  cds-toast-notification[kind="warning"],
  cds-actionable-notification[kind="warning"],
  cds-callout-notification[kind="warning"],
  cds-inline-notification[kind="warning-alt"],
  cds-toast-notification[kind="warning-alt"],
  cds-actionable-notification[kind="warning-alt"],
  cds-callout-notification[kind="warning-alt"] {
    --cds-background-inverse: var(--cds-notification-background-warning, #fcf4d6);
  }
`;
