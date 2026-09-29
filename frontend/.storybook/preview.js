import "@carbon/styles/css/styles.css";
import "happo/storybook/register";
import { html } from "lit";
import "../src/styles/brand-theme.css";

/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (story) =>
      html`<div data-carbon-theme="brand" class="cds--white" style="padding: 1rem;">
        ${story()}
      </div>`,
  ],
};

export default preview;
