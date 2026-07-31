export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type LogoutResponse = {
  message: string;
};
