import axios, { AxiosError } from 'axios';
import { ICreateUser, ILogin } from './types';
import { BASE_URL } from './baseURL';
import { config } from 'config';
import {
  ApiResponseInterface,
  RestorePasswordInterface,
  TokensInterface,
} from 'types';

export class Api {
  static async checkUser(
    token: string,
  ): Promise<ApiResponseInterface<any>> {
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
          headers: {
            'Access-Control-Allow-Origin':
              'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true',
          },
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
  ): Promise<ApiResponseInterface<TokensInterface>> {
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
  ): Promise<ApiResponseInterface<any>> {
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
  ): Promise<ApiResponseInterface<any>> {
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

  static async getQuestion(
    username: string,
    email: string,
  ): Promise<ApiResponseInterface<any>> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.get(
        BASE_URL + '/api/auth/get-question',
        {
          params: { username, email },
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

  static async restorePassword(
    data: RestorePasswordInterface,
  ) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.post(
        BASE_URL + '/api/auth/restore-password',
        data,
        {
          signal: controller.signal,
        },
      );

      clearTimeout(id);

      return { data: res.data, status: 200 };
    } catch (e: any) {
      if (e.response) {
        return {
          status: e.response.status,
          message: e.response.data.message,
        };
      }

      return { status: 5000 };
    }
  }
}
