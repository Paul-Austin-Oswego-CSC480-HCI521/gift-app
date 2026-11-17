import { defineConfig } from "happo";

export default defineConfig({
  apiKey: process.env.HAPPO_API_KEY,
  apiSecret: process.env.HAPPO_API_SECRET,
  project: "default",
  integration: {
    type: "storybook",
    // Not tracked in screenshots. The theme switcher is a control, not a visual state. Happo always
    // renders the default light theme, so the Storybook Theme toolbar never changes snapshots.
    skip: [{ component: "Custom Components/Theme Switcher" }],
  },
  targets: {
    "chrome-large": {
      type: "chrome",
      viewport: "1200x900",
    },
    accessibility: {
      type: "accessibility",
      viewport: "1024x768",
    },
  },
});