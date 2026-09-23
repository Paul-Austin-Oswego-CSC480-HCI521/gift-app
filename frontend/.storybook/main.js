/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.stories.js", "../src/components/**/*.stories.js"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
};

export default config;
