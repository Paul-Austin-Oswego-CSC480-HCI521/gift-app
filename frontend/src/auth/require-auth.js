//Force .htmls to auth or go back to login.
import { getAccessToken } from "./token-store.js";

const LOGIN_URL = "/";

if (!getAccessToken()) {
  window.location.replace(LOGIN_URL);
}