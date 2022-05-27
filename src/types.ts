export interface IAppContext {
  isAuth: boolean;
  setIsAuth: (arg: boolean) => void;
  logout: () => void;
}

export interface ApiResponseInterface<T> {
  data?: T;
  status: number;
  message?: string;
}

export interface TokensInterface {
  access_token: string;
  refresh_token: string;
}

export interface RestorePasswordInterface {
  username: string;
  email: string;
  answer: string;
  password: string;
}

export interface TaskInterface {
  id: string;
  name?: string;
  added?: Date;
  type?: string;
  plannedStart?: Date | null;
  plannedEnd?: Date | null;
  started?: boolean;
  completed?: boolean;
  startedTime?: Date;
  endedTime?: Date;
}
