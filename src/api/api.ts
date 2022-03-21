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
    } = data;

    try {
      const res = await axios.post(BASE_URL + '/reg', {
        username,
        password,
        email,
      });

      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  static async login(data: ILogin) {
    const {
      username,
      password,
    } = data;

    try {
      const res = await axios.post(BASE_URL + '/login', {
        username,
        password,
      });

      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  static async updateProfile(user: any) {
    try {
      const res = await axios.post(BASE_URL + '/profile', user, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      return res;
    } catch (e: any) {
      if (e instanceof Error) {
        console.error('updateProfile() error');
      }
      if (e.response.status == 403) return 403;
    }
  }

  static async getRestoreData(data: IGetRestoreData) {
    try {
      const res = await axios.post(BASE_URL + '/restore', { ...data });

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
      const res = await axios.get(BASE_URL + '/restore', {
        params: { username }
      });
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.error('getQuestion() error');
      }
    }
  }
}