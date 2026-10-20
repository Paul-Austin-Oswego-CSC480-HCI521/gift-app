//This is a unofficial bandaid fix to auth. The token will stay in memory, butttt its also readble
//via scripts. So we will need to find a better solution then this. This is purely to get things rolling.
const KEY = "accessToken";

export const getAccessToken = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const setAccessToken = (token) => {
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
  }
};

export const clearAccessToken = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
  }
};