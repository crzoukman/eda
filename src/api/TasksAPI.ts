import { BASE_URL } from './baseURL';
import axios from 'axios';
import { config } from 'config';
import { TaskInterface } from 'types';

export class TasksAPI {
  static async addTask(data: any, token: string) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.post(
        BASE_URL + '/api/tasks',
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
        return {
          status: e.response.status,
          message: e.response.data.message,
        };
      }

      return { status: 5000 };
    }
  }

  static async getTasks(token: string) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.get(BASE_URL + '/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

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

  static async editTask(
    task: TaskInterface,
    token: string,
  ) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.put(
        BASE_URL + '/api/tasks',
        task,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        },
      );

      clearTimeout(id);

      return res;
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

  static async deleteTask(taskId: string, token: string) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, config.REQUEST_TIMEOUT);

      const res = await axios.delete(
        BASE_URL + '/api/tasks' + '/' + taskId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        },
      );
      return res;
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
