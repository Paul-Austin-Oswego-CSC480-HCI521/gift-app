# Frontend structure

How `frontend/src/` is organized, and where new code should go.

## The pieces

```
frontend/src/
├── index.js              # entry point loaded by an HTML page — registers components and styles
├── components/           # one folder per component, named after its custom element tag
│   └── gift-nav-header/
│       ├── gift-nav-header.js          # component definition
│       ├── gift-nav-header.test.js     # unit/component tests
│       └── gift-nav-header.stories.js  # Storybook story
├── styles/               # global layout and application styles
└── api/                  # fetch wrapper for talking to the backend
```

- **HTML entry points** — compose pages with normal HTML and custom element tags. This is where
  page structure, content, links, and component slots are assembled.
- **`components/<tag-name>/`** — a reusable piece of UI used across pages (e.g. the site header,
  footer, or the pink/orange gradient panel behind page content), exported as a **web component** (a
  registered custom element), not a plain JS function. The folder name matches the custom element
  tag it defines (e.g. `gift-nav-header/` defines `<gift-nav-header>`), and holds that component's
  implementation, test, and Storybook story together — see
  [src/components/gift-gradient-container/gift-gradient-container.js](../src/components/gift-gradient-container/gift-gradient-container.js)
  and its co-located story and test as a template. Prefer wrapping a Carbon web component
  (`<cds-header>`, etc.) over hand-rolling one when Carbon already has it — see
  [src/components/gift-nav-header/gift-nav-header.js](../src/components/gift-nav-header/gift-nav-header.js).
  For anything Carbon doesn't provide, see
  [src/components/gift-gradient-container/gift-gradient-container.js](../src/components/gift-gradient-container/gift-gradient-container.js)
  as a template. See [carbon-conventions.md](carbon-conventions.md#styling) for the styling
  convention (Lit `static styles`, not `<style>` tags or CSS Modules) and
  [frontend-testing.md](frontend-testing.md) for how to write the co-located test.
- **`index.js`** — the entry point Vite loads from each HTML page. It imports global styles and
  component definitions. It should not render the page or contain its HTML structure.

## components/ export web components

Every component folder defines a `LitElement` subclass and registers it with
`customElements.define("gift-...", ...)` (see `gift-nav-header/gift-nav-header.js` /
`gift-gradient-container/gift-gradient-container.js`). Callers import the component file for its
registration side effect, then use the tag directly in HTML:

```js
import "../components/gift-nav-header/gift-nav-header.js";
```

Use HTML attributes for simple configuration (`product-name="Gift App"`). Content that should be
projected into a component goes through its default `<slot>`, as regular HTML children. Prefer
slots for page structure and use JavaScript properties only when a component genuinely needs
structured runtime data.

We're still writing plain JavaScript, not TypeScript (see
[carbon-conventions.md](carbon-conventions.md#javascript-not-typescript-for-now)) — `LitElement`
works fine from JS, you just don't get compile-time checking on `static properties`.

Stories can use Lit for Storybook controls, but should demonstrate the same public HTML contract —
see `gift-nav-header/gift-nav-header.stories.js` and `gift-gradient-container/gift-gradient-container.stories.js`.
`stories/ExampleCarbonButton.stories.js` (top-level `stories/` folder) is the one exception — it's a
template demonstrating a raw Carbon component, not one of our own, so it isn't tied to a component
folder.

