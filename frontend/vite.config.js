import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { fileURLToPath } from "node:url";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dirname = fileURLToPath(new URL(".", import.meta.url));

const PAGES_DIR = "pages";

const findPages = (dir) =>
  readdirSync(join(dirname, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name.startsWith(".") || entry.name.startsWith("_") ? [] : findPages(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });

// Every *.html file under pages/ is a build page, so new pages need no config change.
// Folders starting with "_" (such as _partials) hold fragments, not pages.
const htmlInputs = Object.fromEntries(
  findPages(PAGES_DIR).map((page) => [
    page.slice(PAGES_DIR.length + 1, -".html".length).replaceAll("\\", "/"),
    join(dirname, page),
  ]),
);

// Vite writes pages/people.html to dist/pages/people.html. Netlify serves extensionless URLs
// and 404.html from the publish root, so flatten the output to dist/people.html.
const flattenPagesDir = () => ({
  name: "flatten-pages-dir",
  enforce: "post",
  generateBundle(_options, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.fileName.startsWith(`${PAGES_DIR}/`)) asset.fileName = asset.fileName.slice(PAGES_DIR.length + 1);
    }
  },
});

// Serve /name as pages/name.html in dev, matching Netlify's extensionless URLs.
const prettyUrls = () => ({
  name: "pretty-page-urls",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [path, query] = req.url.split("?");
      const name = path === "/" ? "/index" : path;
      if (/^\/[\w\-/]+$/.test(name) && !name.endsWith("/") && existsSync(join(dirname, PAGES_DIR, `${name}.html`))) {
        req.url = `/${PAGES_DIR}${name}.html${query ? `?${query}` : ""}`;
      }
      next();
    });
  },
});

export default defineConfig({
  // Absolute paths: the site is served from the domain root, and nested pages need that.
  base: "/",
  plugins: [prettyUrls(), flattenPagesDir()],
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
