export interface IUser {
  id: string;
  email: string;
  role: string;
  exp: number;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
}