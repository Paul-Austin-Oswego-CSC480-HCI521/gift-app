import "@carbon/styles/css/styles.css";
import "happo/storybook/register";
import axe from "axe-core";
import { html } from "lit";
import "../src/styles/fonts.css";
import "../src/styles/brand-theme.css";
import "../src/styles/brand-theme-dark.css";
import "../src/styles/carbon-shape-overrides.js";
import "../src/styles/carbon-font-overrides.js";
import { resolveTheme } from "../src/theme/theme.js";

// Every axe rule except color-contrast, switched off for the dark run (see the a11y parameter below).
// Turning rules off, rather than running only color-contrast, keeps the per-story contrast exemptions
// for disabled controls working.
const allRulesExceptContrast = Object.fromEntries(
  axe
    .getRules()
    .map((rule) => rule.ruleId)
    .filter((id) => id !== "color-contrast")
    .map((id) => [id, { enabled: false }]),
);

const THEMES = {
  light: { carbonClass: "cds--white", brandTheme: "brand" },
  dark: { carbonClass: "cds--g100", brandTheme: "brand-dark" },
};

// Only Foundations and tile/card stories get an explicit white background in light mode. Dark keeps
// the themed background, otherwise light text has nothing dark behind it.
const showsPageBackground = (title) => /^Foundations\/|(^|\/)[^/]*(Tile|Card)/.test(title);

// The toolbar theme a run starts with. Stays "light" (what Happo captures). The dark accessibility
// run sets VITE_STORYBOOK_THEME=dark (npm run test:storybook:dark) so axe checks dark contrast too.
const startingTheme = ["light", "dark", "system"].includes(import.meta.env.VITE_STORYBOOK_THEME)
  ? import.meta.env.VITE_STORYBOOK_THEME
  : "light";

/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
    // Storybook's a11y default is report-only ("todo"). The dark run fails on color-contrast so a
    // dark-theme contrast problem blocks a merge. It checks only that rule: the other axe findings
    // are not theme-specific and already show in the light run. Light keeps its current behaviour.
    a11y:
      startingTheme === "dark"
        ? { test: "error", options: { rules: allRulesExceptContrast } }
        : { test: "todo" },
    options: {
      storySort: {
        order: ["Foundations", "Carbon Components", "Custom Components", "Page Layouts"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Brand theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
          { value: "system", icon: "browser", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: startingTheme,
  },
  decorators: [
    (story, context) => {
      // "system" follows the OS, the same as the app's default.
      const theme = resolveTheme(context.globals.theme);
      const { carbonClass, brandTheme } = THEMES[theme] ?? THEMES.light;
      const background =
        theme === "dark"
          ? "var(--cds-background)"
          : showsPageBackground(context.title)
            ? "#fff"
            : "transparent";
      return html`<div
        data-carbon-theme="${brandTheme}"
        class="${carbonClass}"
        style="padding: 1rem; background-color: ${background};"
      >
        ${story()}
      </div>`;
    },
  ],
};

export default preview;
