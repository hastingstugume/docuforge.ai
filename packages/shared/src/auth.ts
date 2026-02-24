export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = LoginInput & {
  fullName: string;
};

export type AuthResponse = {
  ok: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  token: string;
};
