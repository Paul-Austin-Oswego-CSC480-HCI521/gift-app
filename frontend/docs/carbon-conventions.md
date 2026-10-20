# Carbon conventions

> **Wiki candidate:** This is a longer team convention guide. Keep the wiki as the source of truth
> for the rationale and shared Carbon decisions; keep this file focused on details needed while
> editing frontend code.

How we use [Carbon Design System](https://carbondesignsystem.com/) in this project. See the wiki's [ADR: Frontend Framework](../../../../wiki/ADR-Frontend-Framework) for why we picked this over React+Carbon or a framework.

## Package

We use `@carbon/web-components` (built on [Lit](https://lit.dev/)), not `@carbon/react` or any other framework binding. Components are plain custom elements — no framework runtime required to use them.

Import only what you use, from the specific component path, e.g.:

```js
import "@carbon/web-components/es/components/button/index.js";
```

```html
<cds-button kind="primary">Save</cds-button>
```

Don't import the whole library (`@carbon/web-components` with no subpath) — it pulls in every component and slows down the dev server and build.

Browse available components and their attributes/slots at [carbondesignsystem.com/components](https://carbondesignsystem.com/components/overview/) — pick the "Web Components" tab on each component's page for the actual usage syntax (the default tab is often React).

## Theming

Global styles come from the prebuilt CSS: `@carbon/styles/css/styles.css`, imported once in `src/index.js` (and separately in `.storybook/preview.js` for Storybook). Don't hand-write colors, spacing, or typography — use Carbon's tokens and components so contrast/spacing stay WCAG-compliant automatically.

### Applying the brand theme

The project's brand re-theme lives in `src/styles/brand-theme.css` (light) and `src/styles/brand-theme-dark.css` (dark). It only takes effect when the matching attribute is present, so **every page's HTML must put `data-carbon-theme="brand"` on the `<body>` tag**, alongside the Carbon base theme class:

```html
<body class="cds--white" data-carbon-theme="brand">
```

For the dark variant, use `class="cds--g100" data-carbon-theme="brand-dark"` on `<body>` or a wrapping element. When adding a new page, copy the `<body>` tag from `index.html`. Storybook stories apply the same attribute on their wrapper (see `.storybook/preview.js`).

We're using the `white` theme (`class="cds--white"` on `<body>` / story wrapper) as the default. Carbon also ships `g10`, `g90`, `g100` (see [Carbon's theming docs](https://carbondesignsystem.com/elements/color/overview/#theme)) if we ever need a dark theme — that's a design decision, loop in Shauna before changing it project-wide.

## Carbon first

Our `gift-*` components are compositions of Carbon components, not replacements for them. Order of
preference: use a Carbon component as-is, then configure it (attributes, slots, `::part()`, brand
tokens), then compose several into a `gift-*` component, and only then write a custom element for
something Carbon lacks. Custom elements must start with `// carbon-exempt: <reason>`.

`npm run lint:carbon` (also a CI check, `.github/workflows/frontend-checks.yml`) fails when a
component imports no Carbon component or uses a raw `<button>`, `<input>`, `<select>`,
`<textarea>`, `<dialog>`, `<table>`, `<nav>` or `<a>`. The full guide, including the Carbon
component lookup table used by AI tools, is [`../AGENTS.md`](../AGENTS.md).

## JavaScript, not TypeScript (for now)

Per the ADR, we're starting with plain JavaScript since the team is new to JS itself. `@carbon/web-components` works fine from JS — you just don't get compile-time type checking on component props. If in doubt about a component's expected attribute values, check its `.d.ts` file in `node_modules/@carbon/web-components` or the component's page on carbondesignsystem.com.

## Stories

Every component you build or customize should get a Storybook story, co-located in its own folder
under `src/components/<tag-name>/` alongside the component and its test — see
[frontend-structure.md](frontend-structure.md#componentsyour-tag-name) for the full layout. Use
`stories/CarbonComponents/Button.stories.js` as a template for the CSF3 format we use with
`@storybook/web-components-vite` and `lit`'s `html` tag. Stories for stock Carbon components and
token changes stay in the top-level `stories/` folder (`CarbonComponents/`, `Foundations/`); which
Storybook group a story belongs in is defined in [`../AGENTS.md`](../AGENTS.md#where-stories-go-storybook-organization).

Two worked examples of our own components, each co-located with its component and test:

- `src/components/gift-nav-header/gift-nav-header.stories.js` — the standard `<cds-header>` configuration used on every page.
- `src/components/gift-image-container/gift-image-container.stories.js` — a story for a custom (non-Carbon) component.

## Interactive stories (`play` functions)

A story can include a `play` function that drives the component in a real browser (click, type,
press keys) and asserts the result. `npm run test:storybook` runs every `play` function along with the
render and accessibility checks, so a failed assertion fails the story.

**When to add one.** Add a `play` story when the component owns behavior a user triggers:
- it emits a domain event (`login-submit`, `add-gift`, `dashboard-reload`)
- it validates input or shows an error
- it changes state (open/close, enabled/disabled, selection)
- it depends on keyboard handling or focus

**When not to.** Skip it for static or purely visual stories (Foundations, Page Layouts, Nav Header,
Image Container) and for stock Carbon components with nothing of ours on top. A check there only tests
Carbon. Logic that doesn't need a browser (parsing, validation rules, formatting) belongs in the
`*.test.js` unit test, not a `play` story.

**How to write one:**
- Make it its own named story (`EmptySubmit`, `CloseWithX`), not a `play` on `Default`. Name it for the
  behavior. This is a real state, not a demo.
- Import from `storybook/test`: `import { expect, fn, userEvent, waitFor } from "storybook/test";`
- Capture events with `fn()` args and bind them in `render` (`@login-submit=${onSubmit}`), then assert
  on `args.onSubmit`. Hide the arg from the controls table with `argTypes: { onSubmit: { table: { disable: true } } }`.
- Wrap each phase in `await step("...", async () => {...})` so failures read like a sentence.
- Use the helpers in `stories/helpers/shadow.js` (`renderedForm`, `nativeInput`, `typeInto`) to get past
  shadow roots. Await `updateComplete` on the host and its Carbon children before interacting.
- Interact with `userEvent` on the real element (the `cds-button` host, or the native `<input>` inside a
  Carbon input). Assert with `waitFor` for anything async, such as Lit re-renders and `cds-modal-closed`.
- Assert on our component's own state (`host.open`, `invalidText`, `args.onX` calls), not only on
  Carbon's. Test the behavior `gift-*` adds.
- Reuse another story's render with `render: Default.render` when the interaction story needs the same markup.
- If axe flags Carbon's own markup in the story, scope the exemption to that story
  (see [frontend-testing.md](frontend-testing.md#accessibility-test-exceptions-disabled-states)).

Worked examples: `gift-login-form.stories.js` (validation, events, loading),
`gift-modal.stories.js` (close, Escape, fields), `gift-dashboard.stories.js` (events, disabled while loading).

## Styling

Use Lit's `static styles = css\`...\`` (see `gift-image-container.js`), not a literal `<style>` tag
inside `render()`. `static styles` lets Lit share one constructed stylesheet across every instance
of the component; a `<style>` written into the template gets re-parsed per instance instead.

Don't add CSS Modules. Shadow DOM already gives each component its own style scope — CSS Modules
exist to solve global class-name collisions in regular (light) DOM, which isn't a problem we have
here, and it would mean introducing a second, competing styling convention plus a Vite plugin for
no real benefit.

Keep styles inline in the component file while they're small (as `gift-image-container.js` and
`gift-brand.js` do today). If a component's styles grow large enough to make the file
hard to read, extract them into a co-located `<tag-name>.styles.js` that exports the `css` tagged
template, and import it into the component file — still in the same `src/components/<tag-name>/`
folder, not a separate top-level styles directory.

## Using components in pages

Pages are ordinary HTML files, such as `index.html`. They assemble reusable components with
custom element tags:

```html
<gift-nav-header product-name="Gift App"></gift-nav-header>
<gift-image-container>
	<h1>Page content</h1>
</gift-image-container>
```

The page file should describe the structure and content a teammate can see. The component file
should contain reusable behavior and styling. Use regular HTML for content that is only needed on
one page. Use a Web Component when a section is reusable or has its own behavior, and add a
Storybook story so it can be viewed on its own.

