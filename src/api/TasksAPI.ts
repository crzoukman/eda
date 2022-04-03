import { BASE_URL } from "./baseURL";
import axios from "axios";

export class TasksAPI {
  static async addTask(data: any, token: string) {
    try {
      const res = await axios.post(BASE_URL + '/api/tasks', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  static async getTasks(id: string) {
    try {
      const res = await axios.get(BASE_URL + '/api/tasks', {
        params: {
          id,
        }
      });
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  static async deleteTask(id: string, token: string) {
    try {
      const res = await axios.delete(BASE_URL + '/api/tasks' + '/' + id, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  static async editTask(task: any, token: string) {
    try {
      const res = await axios.put(BASE_URL + '/api/tasks', task, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return res;
    } catch (e: any) {
      if (e.response.status === 403) {

      }

      console.log(e.message);

    }
  }
}