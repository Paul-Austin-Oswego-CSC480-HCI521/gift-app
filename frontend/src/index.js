// Carbon's shared colors/spacing/fonts and the page's own layout styles (app.css) are
// linked directly in each page's <head> rather than imported here, so they load as
// blocking stylesheets instead of flashing unstyled content while this JS loads.
import Clarity from "@microsoft/clarity";

Clarity.init("yjthhigok4");

// Importing a component runs its registration code. After these imports, the browser
// knows what the two gift-* custom elements in index.html mean.
import "./components/gift-nav-header/gift-nav-header.js";
import "./components/gift-gradient-container/gift-gradient-container.js";
import "./components/gift-side-nav/gift-side-nav.js";
import "@carbon/web-components/es/components/link/index.js";

// This entry point registers the components used by index.html. Page authors can work in
// HTML while component implementations keep their behavior and state in JavaScript.
import "./components/gift-login-form/gift-login-form.js";
