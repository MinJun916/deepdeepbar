export const ADMIN_SESSION_COOKIE_NAME = 'ddb_admin_session';

type AdminAuthConfig = {
  username: string;
  password: string;
};

export const getAdminAuthConfig = (): AdminAuthConfig | null => {
  const username = process.env.ADMIN_LOGIN_USERNAME ?? process.env.ADMIN_BASIC_AUTH_USERNAME;
  const password = process.env.ADMIN_LOGIN_PASSWORD ?? process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!username || !password) {
    return null;
  }

  return {
    username,
    password,
  };
};
