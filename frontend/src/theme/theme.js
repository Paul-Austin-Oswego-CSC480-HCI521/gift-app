// Light / dark / system theme for the whole app.
//
// Dark is two things on <body> that must be set together (see AGENTS.md "Theming"):
//   class="cds--g100"  +  data-carbon-theme="brand-dark"
// Light is data-carbon-theme="brand" alone. The preference is "light", "dark" or "system"
// (follow the OS, the default). Only an explicit light/dark choice is stored.
//
// pages/_partials/head.html has a small inline copy of the dark-detection logic so the theme is
// applied before first paint. Keep the storage key and the two body settings in sync with it.

export const THEME_KEY = "theme";
export const THEME_CHANGE_EVENT = "gift-theme-change";
export const PREFERENCES = ["light", "dark", "system"];

const DARK_QUERY = "(prefers-color-scheme: dark)";

export const getPreference = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
};

const systemPrefersDark = () => {
  try {
    return window.matchMedia(DARK_QUERY).matches;
  } catch {
    return false;
  }
};

// Turns a preference into the theme actually shown: "light" or "dark".
export const resolveTheme = (preference = getPreference()) => {
  if (preference === "dark") return "dark";
  if (preference === "light") return "light";
  return systemPrefersDark() ? "dark" : "light";
};

// Sets the activation contract on a target element (<body> in the app, a wrapper in Storybook).
export const applyThemeTo = (element, theme) => {
  const dark = theme === "dark";
  element.classList.toggle("cds--g100", dark);
  element.dataset.carbonTheme = dark ? "brand-dark" : "brand";
};

export const applyTheme = (preference = getPreference()) => {
  const theme = resolveTheme(preference);
  applyThemeTo(document.body, theme);
  // Lets native controls and scrollbars match the theme.
  document.documentElement.style.colorScheme = theme;
  return theme;
};

export const setPreference = (preference) => {
  if (!PREFERENCES.includes(preference)) return getPreference();
  try {
    if (preference === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, preference);
  } catch {
    // storage unavailable; the choice just won't persist across visits
  }
  applyTheme(preference);
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { preference } }));
  return preference;
};

// Re-applies the theme when the OS setting changes, but only while following the system.
// Returns a function that stops listening.
export const watchSystemTheme = () => {
  let query;
  try {
    query = window.matchMedia(DARK_QUERY);
  } catch {
    return () => {};
  }
  const onChange = () => {
    if (getPreference() !== "system") return;
    applyTheme("system");
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { preference: "system" } }));
  };
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

// Called once at startup by app/boot.js.
export const initTheme = () => {
  applyTheme();
  return watchSystemTheme();
};
