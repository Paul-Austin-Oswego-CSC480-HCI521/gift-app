# Frontend structure

How `frontend/` is organized, and where new code should go. The app is a Vite **multi-page app**:
each page is its own HTML file with its own script, and shared code is imported, not duplicated.

```
frontend/
├── pages/                  # every page's HTML (auto-built; nested folders allowed)
│   ├── _partials/          # fragments pulled in with <!-- @include name -->, never built as pages
│   ├── index.html          # login
│   ├── dashboard.html
│   └── 404.html
├── src/
│   ├── app/                # boot.js / boot-authed.js: what every page loads first
│   ├── pages/              # one script per page: only that page's wiring
│   ├── components/
│   │   ├── shared/         # app-wide gift-* components (header, side nav, modal, brand)
│   │   └── gift-*/         # other components, one folder per tag
│   ├── config/routes.js    # the list of page routes (side nav reads it)
│   ├── api/  auth/         # backend fetch wrapper; token storage and the login guard
│   ├── styles/             # global styles and Carbon overrides
│   └── index.js            # shared entry for the public (logged-out) pages
├── stories/                # Storybook stories for Carbon, foundations and page layouts
├── scripts/                # lint scripts and the HTML partials Vite plugin
└── (config)                # package.json, vite.config.js, happo.config.mjs, AGENTS.md
```

## Adding a page

A logged-in page needs one HTML file and one script.

1. `pages/<name>.html`. Copy `pages/people.html`. It includes the shared head and app shell, then holds
   the page content:
   ```html
   <head>
     <!-- @include head -->
     <title>People | Gift App</title>
   </head>
   <body data-carbon-theme="brand">
     <!-- @include app-shell active=people -->
     <main class="page-main" aria-label="Page content"> ... </main>
     <script type="module" src="/src/pages/people.js"></script>
   </body>
   ```
2. `src/pages/<name>.js`. Its first line is `import "../app/boot-authed.js";` (redirects to login without
   a token, then loads the theme and shell). Then import the components the page uses and add its wiring.
   Logged-out pages (login, create account, 404) load `/src/index.js` plus their own script and never `boot-authed.js`.
3. If it belongs in the side nav, add it to `src/config/routes.js` and an icon in `gift-side-nav`.

There is no config to edit: `vite.config.js` builds every `*.html` under `pages/`, so a new file is
picked up automatically (nested paths such as `pages/gifts/add-gift.html` become `/gifts/add-gift`).

## Pages, URLs and the build

- **URLs have no `.html`:** the build writes `pages/people.html` to `dist/people.html` and Netlify serves it at
  `/people`. The dev server does the same. Link to `/people`, not `./people.html`, and use root-absolute
  paths (`/src/...`, `/dashboard`) in HTML and JS so they work at any depth.
- **Unknown paths** return `404.html`, which Netlify serves automatically.
- **Partials** (`pages/_partials/`) are expanded at build and in the dev server by
  `scripts/html-partials-plugin.mjs`. `<!-- @include name key=value -->` inserts `name.html`, filling
  `{{key}}` placeholders. Today: `head` (meta, fonts, stylesheets, hide-until-defined rule),
  `nav-header`, and `app-shell` (nav header plus side nav, `active` picks the highlighted link).
- **Page scripts** (`src/pages/`) hold only what is specific to the page. Anything every page needs
  goes in `src/app/boot.js`, so no page can forget it.

## components/

Each component is a **web component** (a registered custom element), not a plain function, in a folder
named after its tag. The folder holds the implementation, test, and Storybook story together. See
[src/components/gift-image-container/gift-image-container.js](../src/components/gift-image-container/gift-image-container.js)
and its co-located story and test as a template. Prefer wrapping a Carbon web component over
hand-rolling one — see
[src/components/shared/gift-nav-header/gift-nav-header.js](../src/components/shared/gift-nav-header/gift-nav-header.js).

- **`shared/`** holds components used across the app (header, side nav, modal, brand). Put a new
  component here when more than one page uses it.
- A component used by a single feature may sit in its own group folder (for example `components/wishlist/gift-wish-card/`).
  Any folder not named `gift-*` is treated as a group, and `npm run lint:carbon` looks inside it.
- See [carbon-conventions.md](carbon-conventions.md#styling) for the styling convention (Lit
  `static styles`, not `<style>` tags or CSS Modules) and [frontend-testing.md](frontend-testing.md) for the
  co-located test.

## components/ export web components

Every component folder defines a `LitElement` subclass and registers it with
`customElements.define("gift-...", ...)` (see `gift-nav-header/gift-nav-header.js` /
`gift-image-container/gift-image-container.js`). Callers import the component file for its
registration side effect, then use the tag directly in HTML:

```js
import "../components/shared/gift-nav-header/gift-nav-header.js";
```

Use HTML attributes for simple configuration (`product-name="Gift App"`). Content that should be
projected into a component goes through its default `<slot>`, as regular HTML children. Prefer
slots for page structure and use JavaScript properties only when a component genuinely needs
structured runtime data.

We're still writing plain JavaScript, not TypeScript (see
[carbon-conventions.md](carbon-conventions.md#javascript-not-typescript-for-now)) — `LitElement`
works fine from JS, you just don't get compile-time checking on `static properties`.

Stories can use Lit for Storybook controls, but should demonstrate the same public HTML contract —
see `shared/gift-nav-header/gift-nav-header.stories.js` and `gift-image-container/gift-image-container.stories.js`.
Stories for stock Carbon components (for example `stories/CarbonComponents/Button.stories.js`) live in
the top-level `stories/` folder because they are not tied to one of our own component folders.

