# Frontend structure

How `frontend/src/` is organized, and where new code should go.

## The pieces

```
frontend/src/
├── index.js              # entry point loaded by an HTML page — registers components and styles
├── components/           # small, reusable pieces (nav header, gradient panel, footer, ...)
├── styles/               # global layout and application styles
└── api/                  # fetch wrapper for talking to the backend
```

- **HTML entry points** — compose pages with normal HTML and custom element tags. This is where
  page structure, content, links, and component slots are assembled.
- **`components/`** — a reusable piece of UI used across pages (e.g. the site header, footer, or
  the pink/orange gradient panel behind page content), exported as a **web component** (a
  registered custom element), not a plain JS function. Give each one a Storybook story
  co-located in `/frontend/stories/` (see [carbon-conventions.md](carbon-conventions.md#stories)).
  Prefer wrapping a Carbon web component (`<cds-header>`, etc.) over hand-rolling one when Carbon
  already has it — see [src/components/nav-header.js](../src/components/nav-header.js) and its
  story, [stories/CarbonHeader.stories.js](../stories/CarbonHeader.stories.js). For anything
  Carbon doesn't provide, see
  [src/components/gradient-container.js](../src/components/gradient-container.js) and its story,
  [stories/GradientContainer.stories.js](../stories/GradientContainer.stories.js), as a template.
- **`index.js`** — the entry point Vite loads from each HTML page. It imports global styles and
  component definitions. It should not render the page or contain its HTML structure.

## components/ export web components

Every file in `components/` defines a `LitElement` subclass and registers it with
`customElements.define("gift-...", ...)` (see `nav-header.js` / `gradient-container.js`). Callers
import the file for its registration side effect, then use the tag directly in HTML:

```js
import "../components/nav-header.js";
```

Use HTML attributes for simple configuration (`product-name="Gift App"`). Content that should be
projected into a component goes through its default `<slot>`, as regular HTML children. Prefer
slots for page structure and use JavaScript properties only when a component genuinely needs
structured runtime data.

We're still writing plain JavaScript, not TypeScript (see
[carbon-conventions.md](carbon-conventions.md#javascript-not-typescript-for-now)) — `LitElement`
works fine from JS, you just don't get compile-time checking on `static properties`.

Stories can use Lit for Storybook controls, but should demonstrate the same public HTML contract —
see
`stories/CarbonHeader.stories.js` and `stories/GradientContainer.stories.js`.

