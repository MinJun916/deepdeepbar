const ACCESS_TOKEN_KEY = 'access_token';

export const getToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
