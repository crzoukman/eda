import axios, { AxiosError } from 'axios';
import { ICreateUser, ILogin } from './types';
import { BASE_URL } from './baseURL';
import { config } from 'config';
import { ApiResponseInterface } from 'types';

interface IGetRestoreData {
  username: string;
  answer: string;
  password: string;
}

export class Api {
  static async checkUser(
    token: string,
  ): Promise<ApiResponseInterface> {
    const controller = new AbortController();

    const id = setTimeout(() => {
      controller.abort();
    }, config.REQUEST_TIMEOUT);

    try {
      const res = await axios.get(
        BASE_URL + '/api/auth/check-user',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        },
      );

      clearTimeout(id);

      return {
        data: res.data,
        status: 200,
      };
    } catch (e: any) {
      if (e.response) {
        return { status: e.response.status };
      }

      return { status: 5000 };
    }
  }

  static async pingServer() {
    try {
      const res = await axios.get(BASE_URL + '/api');

      return {
        status: res.status,
      };
    } catch (e: any) {
      if (e.response) {
        return { status: e.response.status };
      }

      return { status: 5000 };
    }
  }

  static async createUser(data: ICreateUser) {
    const {
      username,
      password,
      email,
      passwordConfirmation,
    } = data;

    try {
      const controller = new AbortController();

      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.post(
        BASE_URL + '/api/auth/signup',
        {
          username,
          password,
          email,
          passwordConfirmation,
        },
        { signal: controller.signal },
      );

      clearTimeout(id);

      return {
        data: res.data,
        status: res.status,
      };
    } catch (e: any) {
      if (e.response) {
        return { status: e.response.status };
      }

      return { status: 5000 };
    }
  }

  static async login(data: ILogin): Promise<{
    access_token?: string;
    refresh_token?: string;
    status: number;
  }> {
    const { username, password } = data;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.post(
        BASE_URL + '/api/auth/signin',
        {
          username,
          password,
        },
        {
          signal: controller.signal,
        },
      );

      clearTimeout(id);

      return {
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        status: res.status,
      };
    } catch (e: any) {
      if (e.response) {
        return { status: e.response.status };
      }

      return { status: 5000 };
    }
  }

  static async refreshTokens(
    token: string,
  ): Promise<ApiResponseInterface> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.get(
        BASE_URL + '/api/auth/refresh-tokens',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        },
      );

      clearTimeout(id);

      return { data: res.data, status: 200 };
    } catch (e: any) {
      if (e.response) {
        return { status: e.response.status };
      }

      return { status: 5000 };
    }
  }

  static async getProfileData(
    token: string,
  ): Promise<ApiResponseInterface> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.get(BASE_URL + '/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(id);

      return { data: res.data, status: 200 };
    } catch (e: any) {
      if (e.response) {
        return { status: e.response.status };
      }

      return { status: 5000 };
    }
  }

  static async updateProfile(
    data: any,
    token: string,
  ): Promise<ApiResponseInterface> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.patch(
        BASE_URL + '/api/users',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        },
      );

      clearTimeout(id);

      return { data: res.data, status: 200 };
    } catch (e: any) {
      if (e.response) {
        return { status: e.response.status };
      }

      return { status: 5000 };
    }
  }

  // ******************************************
  // ******************************************
  // ******************************************
  // ******************************************
  // ******************************************

  static async getRestoreData(data: IGetRestoreData) {
    try {
      const res = await axios.post(
        BASE_URL + '/api/restore',
        { ...data },
      );

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
      const res = await axios.get(
        BASE_URL + '/api/restore',
        {
          params: { username },
        },
      );
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
        'x-refresh': token,
      },
    });
  }
}
