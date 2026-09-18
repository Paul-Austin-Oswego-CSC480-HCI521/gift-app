import "@carbon/styles/css/styles.css";
import happoDecorator from "happo/storybook/decorator";
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
    happoDecorator,
    (story) => html`<div class="cds--white" style="padding: 1rem;">${story()}</div>`,
  ],
};

export default preview;
