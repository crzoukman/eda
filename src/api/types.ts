export interface ICreateUser {
  username: string;
  password: string;
  passwordConfirmation: string;
  email: string;
}

export interface ILogin {
  username: string;
  password: string;
}