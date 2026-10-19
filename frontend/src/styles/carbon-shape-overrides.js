// Rounds the field corners of Carbon's text/password/number/select inputs to match the
// button radius set in brand-theme.css.
//
// Why this can't just be CSS: cds-button and cds-dropdown expose a `part`
// attribute on their clickable surface, so brand-theme.css reaches them with
// `::part()`. cds-text-input, cds-password-input, cds-textarea, cds-number-input and cds-select do
// NOT put a `part` attribute on their inner <input>/<select>/<textarea>, and
// Carbon has no CSS custom property for field radius either — so there is no
// selector in the outside document that can reach that element at all. The only
// way in is to add a stylesheet directly inside each component's own shadow
// root, which is what this file does via `adoptedStyleSheets`.
//
// Each shadow root only ever contains the one field element these components
// render, so plain tag selectors (not Carbon's internal class names, which
// could change between versions) are enough and stay stable across upgrades.

const RADIUS = "var(--radius-small, 0.25rem)"; // matches the ::part() button/dropdown radius in brand-theme.css

const TAG_SELECTORS = {
  "cds-text-input": "input",
  "cds-textarea": "textarea",
  "cds-number-input": "input",
  "cds-password-input": "input",
  "cds-select": "select",
};

const sheet = new CSSStyleSheet();
sheet.replaceSync(
  Object.values(TAG_SELECTORS)
    .map((selector) => `${selector} { border-radius: ${RADIUS}; }`)
    .join("\n")
);

// cds-side-nav hardcodes its panel at 16rem (inline-size and max-inline-size) on a div
// inside the shadow root that exposes no part. Width and the 1px right border come from
// the --side-nav-width token and --cds-border-subtle in brand-theme.css; the 16rem
// fallback keeps Carbon's own width if the token isn't loaded.
const sideNavSheet = new CSSStyleSheet();
sideNavSheet.replaceSync(`
  .cds--side-nav,
  .cds--side-nav--expanded {
    box-sizing: border-box;
    inline-size: var(--side-nav-width, 16rem);
    max-inline-size: var(--side-nav-width, 16rem);
    border-inline-end: 1px solid var(--cds-border-subtle);
  }
`);

const SHEETS = { "cds-side-nav": sideNavSheet };

function upgrade(element) {
  const root = element.shadowRoot;
  const elementSheet = SHEETS[element.localName] ?? sheet;
  if (root && !root.adoptedStyleSheets.includes(elementSheet)) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, elementSheet];
  }
}

const TAG_LIST = [...Object.keys(TAG_SELECTORS), ...Object.keys(SHEETS)];
const SELECTOR = TAG_LIST.join(",");

function upgradeTree(root) {
  if (root.querySelectorAll) {
    root.querySelectorAll(SELECTOR).forEach(upgrade);
  }
}

// Elements already on the page when this module loads.
upgradeTree(document);

// Elements added afterwards — Lit attaches shadowRoot synchronously in the
// element constructor, so it already exists by the time this observer sees it.
new MutationObserver((mutations) => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (TAG_LIST.includes(node.localName)) upgrade(node);
      upgradeTree(node);
    }
  }
}).observe(document.body, { childList: true, subtree: true });
