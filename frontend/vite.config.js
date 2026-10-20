import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { fileURLToPath } from "node:url";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dirname = fileURLToPath(new URL(".", import.meta.url));

// Top-level folders that hold generated output or non-page HTML.
const NON_PAGE_DIRS = new Set([
  "node_modules", "dist", "coverage", "storybook-static", "src", "stories", "docs", "scripts", "test", "public",
]);

const findPages = (dir = "") =>
  readdirSync(join(dirname, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      const skip = entry.name.startsWith(".") || (dir === "" && NON_PAGE_DIRS.has(entry.name));
      return skip ? [] : findPages(path);
    }
    return entry.name.endsWith(".html") ? [path] : [];
  });

// Every *.html file under frontend/ (outside NON_PAGE_DIRS) is a build page, so new pages need no config change.
const htmlInputs = Object.fromEntries(
  findPages().map((page) => [page.slice(0, -".html".length).replaceAll("\\", "/"), join(dirname, page)]),
);

// Serve /name as name.html in dev, matching Netlify's extensionless URLs.
const prettyUrls = () => ({
  name: "pretty-page-urls",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [path, query] = req.url.split("?");
      if (/^\/[\w\-/]+$/.test(path) && !path.endsWith("/") && existsSync(join(dirname, `${path}.html`))) {
        req.url = `${path}.html${query ? `?${query}` : ""}`;
      }
      next();
    });
  },
});

export default defineConfig({
  // Absolute paths: the site is served from the domain root, and nested pages need that.
  base: "/",
  plugins: [prettyUrls()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: htmlInputs,
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.js"],
      exclude: ["src/index.js", "src/**/*.stories.js"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./test/setup.js"],
          include: ["src/**/*.{test,spec}.js"],
        },
      },
      {
        // Runs every Storybook story as a test, in a real Chromium browser via Playwright.
        extends: true,
        plugins: [storybookTest({ configDir: `${dirname}/.storybook` })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
