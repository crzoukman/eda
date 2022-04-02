import { BASE_URL } from "./baseURL";
import axios from "axios";

export class TasksAPI {
  static async addTask(data: any) {
    try {
      const res = await axios.post(BASE_URL + '/api/tasks', data);
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

  static async deleteTask(id: string) {
    try {
      const res = await axios.delete(BASE_URL + '/api/tasks' + '/' + id);
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  static async editTask(task: any) {
    try {
      const res = await axios.put(BASE_URL + '/api/tasks', task);
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }
}