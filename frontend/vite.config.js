import { defineConfig } from "vite";

export default defineConfig({
  //Relative paths, not absolute.
  base: "./",
  server: {
    port: 5173,
  },
});
