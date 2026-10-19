import { html } from "lit";
import "@carbon/web-components/es/components/link/index.js";
import "@carbon/web-components/es/components/ui-shell/index.js";
import "../../src/components/gift-nav-header/gift-nav-header.js";
import "../../src/components/gift-image-container/gift-image-container.js";
import "../../src/components/gift-brand/gift-brand.js";
import "../../src/components/gift-side-nav/gift-side-nav.js";
import "../../src/components/gift-login-form/gift-login-form.js";
import "../../src/components/gift-dashboard/gift-dashboard.js";
import "../../src/styles/brand-theme.css";
import "../../src/styles/brand-theme-dark.css";
import "../../src/styles/page-templates.css";
import "../../src/styles/carbon-page-layout.css";

// The two page templates the app has, defined in page-templates.css: .page-auth (what a visitor
// sees before logging in) and .page-main with the side nav (what a logged-in user sees). Both are
// composed only from the configured Carbon components and the gift-* wrappers, so they stay in
// step with the brand theme (brand-theme.css) rather than carrying page-specific styling.

// app.css's .fill-height (a flex column at least window-height) is reproduced inline rather
// than imported: app.css re-imports Carbon's stylesheet, and loading that after
// brand-theme.css lets Carbon's .cds--white tokens override the brand ones.
const pageColumn = "display: flex; flex-direction: column; min-height: 100vh; flex: 1;";

// cds-header and cds-side-nav are position:fixed, which would pin them to the Storybook
// window instead of the story. A transformed ancestor becomes their containing block, so the
// negative margin cancels the decorator's padding and the layout fills the frame.
const frame = (content) => html`
  <div style="margin: -1rem; min-height: 100vh; display: flex; flex-direction: column; transform: translateZ(0);">
    ${content}
  </div>
`;

export default {
  title: "Page Layouts/App Pages",
  parameters: { layout: "fullscreen" },
};

// The .page-auth template shared by index.html (log in) and create-account.html: header, then
// the image container holding a centered panel with <gift-brand> and the form.
export const Unauthenticated = {
  render: () =>
    frame(html`
      <div class="page-auth" style="${pageColumn}">
        <gift-nav-header product-name="Gift App">
          <cds-header-nav menu-bar-label="Gift App navigation"></cds-header-nav>
        </gift-nav-header>
        <gift-image-container>
          <main class="page-auth__main">
            <section class="page-auth__panel" aria-labelledby="login-heading">
              <gift-brand></gift-brand>
              <header class="page-auth__intro">
                <h1 id="login-heading" class="cds--type-heading-05">Welcome back</h1>
                <p class="cds--type-body-01">Log in for more thoughtful gift-giving.</p>
              </header>
              <gift-login-form></gift-login-form>
              <p class="cds--type-body-01">
                New to Gift App?
                <cds-link href="#create-account">Create account</cds-link>
              </p>
            </section>
          </main>
        </gift-image-container>
      </div>
    `),
};

// The Navigation frame (Usability-Team-Figma-File 1323:4981): header, the gift-side-nav component and an
// empty .page-main region. Page content frames other than the Dashboard are not built yet.
export const Authenticated = {
  render: () =>
    frame(html`
      <div style="${pageColumn}">
        <gift-nav-header product-name="Gift App">
          <cds-header-nav menu-bar-label="Gift App navigation"></cds-header-nav>
        </gift-nav-header>
        <!-- cds-side-nav is position:fixed internally, so it adds no width to the layout; main
             takes a matching margin-inline-start (--side-nav-width) instead. -->
        <gift-side-nav></gift-side-nav>
        <main class="page-main" aria-label="Page content"></main>
      </div>
    `),
};

// dashboard.html: the Authenticated template with <gift-dashboard> as the page content.
export const Dashboard = {
  render: () =>
    frame(html`
      <div style="${pageColumn}">
        <gift-nav-header product-name="Gift App">
          <cds-header-nav menu-bar-label="Gift App navigation"></cds-header-nav>
        </gift-nav-header>
        <gift-side-nav active="dashboard"></gift-side-nav>
        <main class="page-main" aria-label="Page content">
          <gift-dashboard
            .user=${{
              fullName: "Test User 1",
              people: [
                {
                  fullName: "Alex Rivera",
                  gifts: [
                    {
                      name: "Pour-over coffee set",
                      type: "Physical",
                      status: { stage: "Need to buy" },
                      occasion: { name: "Birthday", date: "2026-11-14" },
                    },
                  ],
                },
                { fullName: "Sam Patel", gifts: [] },
              ],
            }}
          ></gift-dashboard>
        </main>
      </div>
    `),
};
