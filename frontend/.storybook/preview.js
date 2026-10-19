import "@carbon/styles/css/styles.css";
import "happo/storybook/register";
import { html } from "lit";
import "../src/styles/fonts.css";
import "../src/styles/brand-theme.css";
import "../src/styles/brand-theme-dark.css";
import "../src/styles/carbon-shape-overrides.js";
import "../src/styles/carbon-font-overrides.js";

const THEMES = {
  light: { carbonClass: "cds--white", brandTheme: "brand" },
  dark: { carbonClass: "cds--g100", brandTheme: "brand-dark" },
};

/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
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
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (story, context) => {
      const { carbonClass, brandTheme } = THEMES[context.globals.theme] ?? THEMES.light;
      return html`<div
        data-carbon-theme="${brandTheme}"
        class="${carbonClass}"
        style="padding: 1rem;"
      >
        ${story()}
      </div>`;
    },
  ],
};

export default preview;
