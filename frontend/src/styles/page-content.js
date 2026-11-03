import { css } from "lit";

// Shared base for a `gift-*` component that is a page's content (gift-dashboard, gift-people,
// gift-upcoming-dates): a full-width column with the Figma 32px gap, and the page title. Page padding
// comes from .page-main, so the host adds none. The page title is also the `.page-title` rule in
// brand-theme.css, but a descendant selector there cannot cross a shadow boundary, so each page
// component adds this to its `static styles` (same reason as notification-theme.js).
export const pageContentStyles = css`
  :host {
    display: flex;
    inline-size: 100%;
    flex-direction: column;
    gap: var(--cds-spacing-07, 2rem);
    color: var(--cds-text-primary);
  }

  h1 {
    margin: 0;
    font-family: var(--font-family-heading);
    font-size: var(--page-title-font-size);
    line-height: var(--page-title-line-height);
    font-weight: var(--page-title-font-weight);
    letter-spacing: 0;
  }
`;
