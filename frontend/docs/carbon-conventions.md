# Carbon conventions

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

We're using the `white` theme (`class="cds--white"` on `<body>` / story wrapper) as the default. Carbon also ships `g10`, `g90`, `g100` (see [Carbon's theming docs](https://carbondesignsystem.com/elements/color/overview/#theme)) if we ever need a dark theme — that's a design decision, loop in Shauna before changing it project-wide.

## JavaScript, not TypeScript (for now)

Per the ADR, we're starting with plain JavaScript since the team is new to JS itself. `@carbon/web-components` works fine from JS — you just don't get compile-time type checking on component props. If in doubt about a component's expected attribute values, check its `.d.ts` file in `node_modules/@carbon/web-components` or the component's page on carbondesignsystem.com.

## Stories

Every component you build or customize should get a Storybook story, co-located in `/frontend/stories/` (or a subfolder if a feature area needs more than one, e.g. `stories/gift-list/`). Use `stories/ExampleCarbonButton.stories.js` as a template — it shows the CSF3 format we use with `@storybook/web-components-vite` and `lit`'s `html` tag.

Two more worked examples:

- `stories/CarbonHeader.stories.js` — the standard `<cds-header>` configuration used on every page.
- `stories/GradientContainer.stories.js` — a story for a custom (non-Carbon) component; see [../docs/frontend-structure.md](frontend-structure.md) for where components like this live in `src/`.

## Using components in pages

Pages are ordinary HTML files, such as `index.html`. They assemble reusable components with
custom element tags:

```html
<gift-nav-header product-name="Gift App"></gift-nav-header>
<gift-gradient-container>
	<h1>Page content</h1>
</gift-gradient-container>
```

The page file should describe the structure and content a teammate can see. The component file
should contain reusable behavior and styling. Use regular HTML for content that is only needed on
one page. Use a Web Component when a section is reusable or has its own behavior, and add a
Storybook story so it can be viewed on its own.

