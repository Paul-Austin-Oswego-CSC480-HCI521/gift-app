// Carbon's shared colors, spacing, fonts, and accessible defaults.
import "@carbon/styles/css/styles.css";
import Clarity from "@microsoft/clarity";

Clarity.init("yjthhigok4");

// Styles used by the page itself, such as the full-height layout.
import "./styles/app.css";

// Importing a component runs its registration code. After these imports, the browser
// knows what the two gift-* custom elements in index.html mean.
import "./components/gift-nav-header/gift-nav-header.js";
import "./components/gift-gradient-container/gift-gradient-container.js";
import "./components/gift-site-footer/gift-site-footer.js";

// Vite removes this diagnostic control and its import from production builds.
if (import.meta.env.DEV) {
  import("./components/database-status.js").then(() => {
    document.querySelector("gift-gradient-container")?.append(
      document.createElement("gift-database-status"),
    );
  });
}

// This entry point registers the components used by index.html. Page authors can work in
// HTML while component implementations keep their behavior and state in JavaScript.
