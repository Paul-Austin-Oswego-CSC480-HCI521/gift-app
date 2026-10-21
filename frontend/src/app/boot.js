// Shared bootstrap for every app page: theme, Carbon overrides and the header/side-nav shell.
// Page scripts import this (or boot-authed.js) first, then add their own page wiring.

// Patches attachShadow, so it must load before any gift-*/cds-* element upgrades.
import "../styles/carbon-font-overrides.js";
import "../styles/carbon-shape-overrides.js";
import "../styles/brand-theme.css";

import "@carbon/web-components/es/components/ui-shell/index.js";
import "../components/shared/gift-nav-header/gift-nav-header.js";
import "../components/shared/gift-side-nav/gift-side-nav.js";
