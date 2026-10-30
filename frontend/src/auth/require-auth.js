//Force .htmls to auth or go back to login.
import { getAccessToken, getUserId } from "./token-store.js";

const LOGIN_URL = "/";

if (!getAccessToken() || !getUserId()) {
  window.location.replace(LOGIN_URL);
}