import axios from "axios";
import { ICreateUser, ILogin } from "./types";
import { BASE_URL } from './baseURL';

interface IGetRestoreData {
  username: string;
  answer: string;
  password: string;
}

export class Api {
  static async createUser(data: ICreateUser) {
    const {
      username,
      password,
      email,
      passwordConfirmation,
    } = data;

    try {
      const res = await axios.post(BASE_URL + '/api/create', {
        username,
        password,
        email,
        passwordConfirmation,
      });

      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  static login(data: ILogin) {
    const {
      username,
      password,
    } = data;

    return axios.post(BASE_URL + '/api/session', {
      username,
      password,
    });
  }

  static updateProfile(user: any, token: string) {
    return axios.post(BASE_URL + '/api/update', user, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  static async getRestoreData(data: IGetRestoreData) {
    try {
      const res = await axios.post(BASE_URL + '/api/restore', { ...data });

      if (res.data !== null) return true;
      return false;
    } catch (e) {
      if (e instanceof Error) {
        console.error('getRestoreData() error');
      }
    }
  }

  static async getQuestion(username: string) {
    try {
      const res = await axios.get(BASE_URL + '/api/restore', {
        params: { username }
      });
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.error('getQuestion() error');
      }
    }
  }

  static refreshToken(token: string) {
    return axios.post(BASE_URL + '/api/refresh', null, {
      headers: {
        'x-refresh': token
      }
    });
  }
}