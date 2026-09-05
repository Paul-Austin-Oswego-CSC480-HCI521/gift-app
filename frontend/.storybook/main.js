/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.stories.js"],
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
};

export default config;
