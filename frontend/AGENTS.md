# Frontend agent instructions (Codex and other AI coding tools)

The frontend is a Vite app built on **IBM Carbon Design System web components**
(`@carbon/web-components`, built on Lit), plain JavaScript, with a project brand theme layered on
top. Our own `gift-*` components are almost always **compositions of Carbon components**, not
replacements for them. Read this before creating or editing any component.

Why: Carbon provides the accessibility behavior (ARIA roles, keyboard handling, focus management,
contrast) that this course requires. A hand-built element throws that away. `<gift-side-nav>` was
originally built from raw `<nav>`/`<a>` and was rebuilt on `cds-side-nav` for exactly this reason.

## The rule: Carbon first

Before writing any new element, work through these in order and stop at the first that works:

1. **Use a Carbon component as-is**, in the page HTML or in a story.
2. **Configure it**: attributes, slots, `::part()` selectors, and tokens in `src/styles/brand-theme.css`.
3. **Compose several Carbon components** into a `gift-*` component (see Composition below).
4. **Only then** write a custom element, and only for something Carbon genuinely lacks. The file
   must start with `// carbon-exempt: <specific reason Carbon has nothing suitable>`.

"Carbon doesn't look like the design" is not a reason to skip Carbon. Change the look through the
theme (step 2). A mockup that looks custom is usually a Carbon component plus tokens.

Never hand-roll these. Use the Carbon equivalent:

| Need | Use |
| --- | --- |
| button | `cds-button` |
| text / password / number / search input | `cds-text-input`, `cds-password-input`, `cds-number-input`, `cds-search` |
| checkbox, radio, toggle | `cds-checkbox`, `cds-radio-button`, `cds-toggle` |
| select / dropdown / combo box | `cds-select`, `cds-dropdown`, `cds-combo-box` |
| link | `cds-link` |
| header and top navigation | `cds-header`, `cds-header-nav`, `cds-header-nav-item` |
| side navigation | `cds-side-nav`, `cds-side-nav-items`, `cds-side-nav-link`, `cds-side-nav-divider` |
| modal / dialog | `cds-modal` (`cds-modal-header`, `cds-modal-body`) |
| card / surface | `cds-tile` |
| tag / badge | `cds-tag` |
| table | `cds-table`, `cds-data-table` |
| tabs, accordion, breadcrumb | `cds-tabs`, `cds-accordion`, `cds-breadcrumb` |
| inline errors / banners | `cds-inline-notification`, `cds-callout-notification` |
| loading | `cds-inline-loading`, `cds-loading` |

The full list is the folders in `node_modules/@carbon/web-components/es/components/`. Check there
(and the component's `.d.ts`) before concluding Carbon has nothing. Carbon's own usage docs:
<https://web-components.carbondesignsystem.com/> (use the Web Components tab, not React).

## Composition: how a `gift-*` component is built

A `gift-*` component is a Lit element whose template is mostly `cds-*` elements. See
`src/components/gift-login-form/` and `src/components/gift-create-account-form/`: they compose
`cds-text-input`, `cds-password-input`, `cds-checkbox`, `cds-button` and
`cds-inline-notification`, and add only what Carbon does not: validation rules, state, and a
domain event (`login-submit`).

- Import each Carbon component from its own path (`@carbon/web-components/es/components/button/index.js`).
  Never import the package root.
- Put behavior in the component (validation, state, events). Put visual decisions in tokens.
- Forward accessible names (`label`, `aria-label`) to the Carbon element. Never drop them.
- Reach inside a Carbon component only through its documented slots and `::part()` names.
- Navigation that exists on every page belongs in one shared component, not copied per page. See
  `src/components/gift-side-nav/`: it wraps Carbon's `cds-side-nav` and renders into the light DOM
  (`createRenderRoot() { return this; }`) so the page-level brand theme and overrides still reach
  it. Do this when theme rules target a Carbon element from outside a shadow root.

## Styling and theming

- Never hardcode colors, fonts, or spacing. Use Carbon tokens (`var(--cds-...)`) and the brand
  variables in `src/styles/brand-theme.css`. Add a new token there rather than a hex in a component.
- Every page `<body>` needs `class="cds--white" data-carbon-theme="brand"` (dark: `cds--g100` and
  `brand-dark`), or the brand colors do not apply.
- Headings use Outfit (`--font-family-heading`). `brand-theme.css` applies it to `h1`-`h6` and
  `cds--type-heading-*` in the page, but those rules cannot reach inside a shadow root: a `gift-*`
  component that renders its own heading must set `font-family: var(--font-family-heading)` (and
  size/weight from tokens) in its `static styles`. See `gift-dashboard`.
- Component styles use Lit `static styles = css\`...\``. No CSS Modules, no `<style>` in `render()`.
- Shared page layouts (`.page-auth`, `.page-main`, side nav footer) live in
  `src/styles/page-templates.css`. Reuse them. Do not add per-page layout CSS.
- `carbon-shape-overrides.js` and `carbon-font-overrides.js` exist because some Carbon styling
  cannot be reached from outside the shadow root. Read their header comments before adding another
  override, and extend them rather than adding a parallel mechanism.

## Where stories go (Storybook organization)

Storybook has exactly four top-level groups. Put every story in one of them. **Do not create any
other top-level group or folder**: no `Example/`, `Examples/`, `Demo/`, `Playground/`, `Misc/`,
`Test/` or one named after yourself or a feature. If a story seems to fit none, it fits one of
these four, or you should ask a maintainer before adding a fifth.

| Storybook group (`title:`) | Put here | File location |
| --- | --- | --- |
| `Foundations/...` | A **foundational override** of Carbon's variables, shown visually: color tokens, border radius, typography, spacing, and brand assets such as the logo (`gift-brand`). If you change a `--cds-*` token or add a brand variable in `brand-theme.css`, log it here so the team can see it. | `stories/Foundations/<Name>.stories.js` |
| `Carbon Components/...` | An **unchanged Carbon component with our theming applied**, e.g. Button, Tag, Tile, Modal. Plain `cds-*` markup only, no `gift-*` elements and no app-specific text. Used to review the brand theme against Carbon itself. | `stories/CarbonComponents/<Name>.stories.js` |
| `Custom Components/...` | A **component specific to our app**: any `gift-*` element, such as a side nav with our links, a login form, a nav header. Usually a composition of Carbon components with app-specific content and behavior. | `src/components/<tag-name>/<tag-name>.stories.js`, next to the component |
| `Page Layouts/...` | Whole-page templates assembled from the above (`.page-auth`, header + side nav + `.page-main`). | `stories/PageLayouts/<Name>.stories.js` |

Quick test: *Is it a token, variable or brand asset (logo, wordmark)?* Foundations. *Is it a stock Carbon component
and nothing else?* Carbon Components. *Does it contain our own `gift-*` element or our own
wording or behavior?* Custom Components.

Rules:
- Title format is `"<Group>/<Title Case Name>"`, e.g. `"Custom Components/Side Nav"`. The name
  matches the component (`gift-side-nav` becomes `Side Nav`).
- One component appears in one place. Never show the same `gift-*` component under both Carbon
  Components and Custom Components. Page Layouts may reuse it.
- Custom component stories are co-located and named `<tag-name>.stories.js`. Only Foundations,
  Carbon Components and Page Layouts stories go in the top-level `stories/` folder, even when the
  subject is a `gift-*` element that is a brand asset (the logo's story is
  `stories/Foundations/Brand.stories.js`).
- Default story export is `Default`. Add further stories only for real states (error, loading,
  active), not for demos.
- Don't import `brand-theme.css` or other global theme files in a story: `.storybook/preview.js`
  already loads them. Import only what the story itself needs, such as `page-templates.css`.
- Don't scatter new "example", "demo" or "template" files. Existing patterns to copy:
  `stories/CarbonComponents/Button.stories.js` (Carbon),
  `src/components/gift-nav-header/gift-nav-header.stories.js` (custom),
  `stories/Foundations/BorderRadius.stories.js` (foundation; `Brand.stories.js` is the logo).

## Required for every component

Each component lives in `src/components/<tag-name>/` and the folder, file and tag share one name:

- `<tag-name>.js`: the component
- `<tag-name>.stories.js`: a Storybook story under `Custom Components/` (see above; required by the PR checklist)
- `<tag-name>.test.js`: Vitest + Testing Library test

Also: plain JavaScript (no TypeScript), keyboard operable, and every control has an accessible name.

## Verify before you say you are done

Run from `frontend/`:

```sh
npm run lint:carbon     # Carbon-first + Carbon attribute checks, also runs in CI and must pass to merge
npm run test:unit
npm run test:storybook  # runs every story in a browser, includes accessibility checks
npm run build
```

### Accessibility test exceptions

Color-contrast rules do not apply to disabled elements (WCAG 1.4.3 exempts inactive components), so
never "fix" a contrast failure on a disabled control by restyling it. If axe still flags one (for
example Carbon's disabled password label, which isn't linked to its input), disable only the
`color-contrast` rule on that disabled-state story via `parameters.a11y.config.rules`, with a comment
saying why. See `gift-login-form.stories.js`. Don't turn off other rules or exempt enabled states.

`npm run lint:carbon` fails if a component imports no Carbon component or renders a raw
`<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`, `<table>`, `<nav>` or `<a>`. Fix the
design rather than adding an exemption. Exemptions are reviewed, and a vague reason will be
rejected.

It also fails if a `<cds-*>` element in a template uses an attribute Carbon does not declare for
it, or omits a required accessibility label (for example `aria-label` on `cds-side-nav`).
Attribute names differ per element: `cds-side-nav-link` uses `active`, `cds-header-nav-item` uses
`is-active`. Do not guess or copy the React prop name. Look the element up in
`node_modules/@carbon/web-components/custom-elements.json` (or the Web Components tab of the
Carbon docs), and mark the current page link with `aria-current="page"` as well as its active
attribute. The check is `scripts/check-carbon-attributes.mjs`.

## More context

- `docs/carbon-conventions.md`: how we use Carbon, theming, stories, styling
- `docs/frontend-structure.md`: folder layout
- `docs/frontend-testing.md`: testing approach
- Wiki (rationale): ADR-Frontend-Framework, Carbon-Design-System-in-Figma, Storybook-Guide
- Per course policy, say in the PR that an AI tool was used and for what. You own the result.
