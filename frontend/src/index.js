// Carbon's shared colors, spacing, fonts, and accessible defaults.
import "@carbon/styles/css/styles.css";
// Styles used by the page itself, such as the full-height layout.
import "./styles/app.css";

// Importing a component runs its registration code. After these imports, the browser
// knows what the two gift-* custom elements in index.html mean.
import "./components/nav-header.js";
import "./components/gradient-container.js";

// This entry point registers the components used by index.html. Page authors can work in
// HTML while component implementations keep their behavior and state in JavaScript.
