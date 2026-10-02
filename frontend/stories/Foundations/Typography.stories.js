import { html } from "lit";
import "../../src/styles/fonts.css";
import "../../src/styles/brand-theme.css";
import "../../src/styles/carbon-page-layout.css";

// Carbon's type scale (font-size/line-height/weight/letter-spacing), read straight from
// @carbon/type (`require("@carbon/type").heading01` etc.) rather than guessed - Carbon
// ships the values but doesn't compile cds--type-* size/line-height CSS into
// @carbon/styles/css/styles.css unless a project builds its own Sass and calls
// `@include type.type-classes()`, which this project doesn't (no Sass here at all - see
// brand-theme.css). Each sample below applies its real metrics inline so this story shows
// the typography accurately regardless of that gap. Font-family comes from the
// --font-family-heading/--font-family-body tokens defined in brand-theme.css (Outfit for
// headings, Roboto for everything else) - keep both lists in sync with that file.
const HEADINGS = [
  ["Heading 07", "cds--type-heading-07", "3.375rem", 1.199, 300, "0"],
  ["Heading 06", "cds--type-heading-06", "2.625rem", 1.199, 300, "0"],
  ["Heading 05", "cds--type-heading-05", "2rem", 1.25, 400, "0"],
  ["Heading 04", "cds--type-heading-04", "1.75rem", 1.28572, 400, "0"],
  ["Heading 03", "cds--type-heading-03", "1.25rem", 1.4, 400, "0"],
  ["Heading 02", "cds--type-heading-02", "1rem", 1.5, 600, "0"],
  ["Heading 01", "cds--type-heading-01", "0.875rem", 1.42857, 600, "0.16px"],
];

const BODY = [
  ["Body 02", "cds--type-body-02", "1rem", 1.5, 400, "0"],
  ["Body 01", "cds--type-body-01", "0.875rem", 1.42857, 400, "0.16px"],
  ["Body compact 02", "cds--type-body-compact-02", "1rem", 1.375, 400, "0"],
  ["Body compact 01", "cds--type-body-compact-01", "0.875rem", 1.28572, 400, "0.16px"],
];

const CAPTIONS = [
  ["Caption 02", "cds--type-caption-02", "0.875rem", 1.28572, 400, "0.32px"],
  ["Caption 01", "cds--type-caption-01", "0.75rem", 1.33333, 400, "0.32px"],
  ["Label 02", "cds--type-label-02", "0.875rem", 1.28572, 400, "0.16px"],
  ["Label 01", "cds--type-label-01", "0.75rem", 1.33333, 400, "0.32px"],
  ["Helper text 02", "cds--type-helper-text-02", "0.875rem", 1.28572, 400, "0.16px"],
  ["Helper text 01", "cds--type-helper-text-01", "0.75rem", 1.33333, 400, "0.32px"],
];

// 1rem == 16px in this app (no root font-size override), so this is just for the
// human-readable px readout next to each sample - it isn't used for layout.
const remToPx = (rem) => parseFloat(rem) * 16;

const sample = (fontFamilyVar) => ([name, className, fontSize, lineHeight, weight, letterSpacing]) => {
  const fontSizePx = remToPx(fontSize);
  const lineHeightPx = Math.round(fontSizePx * lineHeight * 100) / 100;
  return html`
    <div class="type-sample">
      <p
        class="type-sample-text ${className}"
        style="font-family: var(${fontFamilyVar}); font-size: ${fontSize}; line-height: ${lineHeight}; font-weight: ${weight}; letter-spacing: ${letterSpacing};"
      >
        ${name} - the quick brown fox jumps over the lazy dog
      </p>
      <p class="type-sample-meta">
        <code>.${className}</code> - ${fontSize} (${fontSizePx}px) / ${lineHeightPx}px line
        height - weight ${weight} - letter spacing ${letterSpacing}
      </p>
    </div>
  `;
};

export default {
  title: "Foundations/Typography",
  render: () => html`
    <div data-carbon-theme="brand" style="display: flex; flex-direction: column; gap: 2rem;">
      <section class="page-section">
        <h3 class="page-section-heading">Headings - Outfit (--font-family-heading)</h3>
        <div class="type-sample-list">${HEADINGS.map(sample("--font-family-heading"))}</div>
      </section>
      <section class="page-section">
        <h3 class="page-section-heading">Body text - Roboto (--font-family-body)</h3>
        <div class="type-sample-list">${BODY.map(sample("--font-family-body"))}</div>
      </section>
      <section class="page-section">
        <h3 class="page-section-heading">Captions &amp; labels - Roboto (--font-family-body)</h3>
        <div class="type-sample-list">${CAPTIONS.map(sample("--font-family-body"))}</div>
      </section>
    </div>
  `,
};

export const Default = {};
