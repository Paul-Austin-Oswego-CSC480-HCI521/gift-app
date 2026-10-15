//This is a unofficial bandaid fix to auth. The token will stay in memory, butttt its also readble
//via scripts. So we will need to find a better solution then this. This is purely to get things rolling.
const KEY = "accessToken";
const USER_ID_KEY = "userId";

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


  export const getUserId = () => {
    try {
      return sessionStorage.getItem(USER_ID_KEY);
    } catch {
      return null;
    }
  };

  export const setUserId = (id) => {
    try {
      sessionStorage.setItem(USER_ID_KEY, String(id));
    } catch {
    }
  };

export const clearAccessToken = () => {
  try {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(USER_ID_KEY);
  } catch {
  }
};