import "@carbon/styles/css/styles.css";
import { html } from "lit";

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
    (story) => html`<div class="cds--white" style="padding: 1rem;">${story()}</div>`,
  ],
};

export default preview;
