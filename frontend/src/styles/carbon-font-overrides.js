// Applies --font-family-body (see brand-theme.css) to every Carbon web component's own
// text, overriding the IBM Plex Sans/Mono Carbon hardcodes inside each component's own
// shadow DOM.
//
// Why this can't just be CSS: Carbon's web components compile their Sass type styles
// into literal `font-family: IBM Plex Sans, ...` rules inside each component's own
// shadow root, not behind a CSS custom property — so brand-theme.css's
// --font-family-body (a custom property, which does cross shadow boundaries) has
// nothing to attach to once it reaches a cds-* element. Same root cause and fix shape as
// the border-radius problem in carbon-shape-overrides.js: inject a stylesheet directly
// into the shadow root via adoptedStyleSheets.
//
// Why this also has to walk shadow roots recursively (carbon-shape-overrides.js doesn't):
// cds-text-input, cds-button, etc. aren't siblings of the gift-* components in the light
// DOM — they're rendered *inside* each gift-* component's own shadow root (gift-login-form,
// gift-create-account-form and gift-nav-header all use Lit's default shadow DOM). A
// querySelectorAll/MutationObserver scoped to `document` can't see past that boundary, so
// this watches every shadow root it discovers, not just the document.
//
// No document heading lives inside a Carbon component's shadow root in this app, so one
// rule — inherit --font-family-body — covers all of them without needing a heading
// exception. `!important` is required because Carbon's own selectors are more specific
// than a generic `*` and would otherwise still win regardless of stylesheet order.
//
// Timing: a gift-* component's shadow root exists synchronously once it upgrades, but
// Lit renders its *contents* (the cds-* children) asynchronously afterwards, on a
// microtask. Scanning the document once at import time (as carbon-shape-overrides.js
// does) can run before that shadow root even exists yet — e.g. gift-create-account-form
// is only defined once create-account.js's import runs, which is after this module has
// already finished — so there'd be nothing to attach a MutationObserver to in time.
// Patching attachShadow sidesteps all of that: every shadow root, at every nesting depth,
// is caught the instant it's created, regardless of module/import order.

const sheet = new CSSStyleSheet();
sheet.replaceSync(
  `:host { font-family: var(--font-family-body); } * { font-family: inherit !important; }`
);

function isCarbonElement(node) {
  return typeof node.localName === "string" && node.localName.startsWith("cds-");
}

function upgrade(element) {
  const root = element.shadowRoot;
  if (root && !root.adoptedStyleSheets.includes(sheet)) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  }
}

function visit(element) {
  if (isCarbonElement(element)) upgrade(element);
  if (element.querySelectorAll) element.querySelectorAll("*").forEach(visit);
}

function watch(root) {
  root.querySelectorAll("*").forEach(visit);
  new MutationObserver((mutations) => {
    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) visit(node);
      }
    }
  }).observe(root, { childList: true, subtree: true });
}

const nativeAttachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function (init) {
  const root = nativeAttachShadow.call(this, init);
  if (isCarbonElement(this)) upgrade(this);
  watch(root);
  return root;
};

// Covers anything that already had a shadow root attached before this module ran.
watch(document);
