import { defineConfig } from "happo";

export default defineConfig({
  apiKey: process.env.HAPPO_API_KEY,
  apiSecret: process.env.HAPPO_API_SECRET,
  project: "default",
  integration: {
    type: "storybook",
  },
  targets: {
    "chrome-large": {
      type: "chrome",
      viewport: "1200x900",
    },
    "chrome-small": {
      type: "chrome",
      viewport: "375x667",
    },
    accessibility: {
      type: "accessibility",
      viewport: "1024x768",
    },
  },
});