// Vite plugin: expands `<!-- @include name key=value -->` in page HTML with the contents of
// pages/_partials/<name>.html, so the shared <head> and app shell live in one place.
// Partials may use {{key}} placeholders (filled from the include's key=value args, empty if
// omitted) and may include other partials. It runs at build and in the dev server.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const INCLUDE = /^([ \t]*)<!--\s*@include\s+([\w-]+)((?:\s+[\w-]+=[^\s>]+)*)\s*-->/gm;

export function htmlPartials({ dir }) {
  const expand = (html, stack = []) =>
    html.replace(INCLUDE, (_match, indent, name, rawArgs) => {
      if (stack.includes(name)) throw new Error(`Circular @include: ${[...stack, name].join(" -> ")}`);
      const file = join(dir, `${name}.html`);
      if (!existsSync(file)) throw new Error(`@include "${name}" not found: expected ${file}`);

      const args = Object.fromEntries([...rawArgs.matchAll(/([\w-]+)=(\S+)/g)].map((m) => [m[1], m[2]]));
      const filled = readFileSync(file, "utf8")
        .trimEnd()
        .replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_m, key) => args[key] ?? "");
      return expand(filled, [...stack, name])
        .split("\n")
        .map((line) => (line ? indent + line : line))
        .join("\n");
    });

  return {
    name: "html-partials",
    transformIndexHtml: { order: "pre", handler: (html) => expand(html) },
    configureServer(server) {
      // Partials are not part of the module graph, so reload the page when one changes.
      server.watcher.add(dir);
      server.watcher.on("change", (file) => {
        if (file.startsWith(dir)) server.ws.send({ type: "full-reload" });
      });
    },
  };
}
