import { worker } from 'index';
import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';

export interface ILogin {
  type: string;
  username: string;
  password: string;
}

interface IUser {
  username: string;
  email: string;
}

interface IProfile {
  firstname: string;
  lastname: string;
  patronymic: string;
  question: string;
  answer: string;
}

class WorkerApi {
  static login(userData: ILogin): void {
    worker.port.postMessage(userData);
  }

  static async checkUser(token: string) {
    return {
      data: null,
      status: 200,
    };
  }

  static getProfileData(token: string) {
    const decoded = jwtDecode(token) as IUser;

    const request = {
      type: 'getProfileData',
      request: {
        ...decoded,
      },
    };

    worker.port.postMessage(request);
  }

  static updateProfile(
    profileState: IProfile,
    token: string,
  ) {
    const decoded = jwtDecode(token) as IUser;

    const request = {
      type: 'updateProfile',
      request: {
        ...decoded,
        data: { ...profileState },
      },
    };

    worker.port.postMessage(request);
  }

  static getTasks(token: string) {
    const decoded = jwtDecode(token) as IUser;

    const request = {
      type: 'getTasks',
      request: {
        ...decoded,
      },
    };

    worker.port.postMessage(request);
  }

  static addTask(data: any, token: string) {
    const decoded = jwtDecode(token) as IUser;
    data.id = uuidv4();

    const request = {
      type: 'addTask',
      request: { ...decoded, data },
    };

    worker.port.postMessage(request);
  }

  static editTask(data: any, token: string) {
    const decoded = jwtDecode(token) as IUser;

    const request = {
      type: 'editTask',
      request: { ...decoded, data },
    };

    worker.port.postMessage(request);
  }

  static deleteTask(id: any, token: string) {
    const decoded = jwtDecode(token) as IUser;

    const request = {
      type: 'deleteTask',
      request: { ...decoded, data: id },
    };

    worker.port.postMessage(request);
  }

  static setTasks(data: any, token: string) {
    const decoded = jwtDecode(token) as IUser;

    const request = {
      type: 'setTasks',
      request: { ...decoded, data },
    };

    worker.port.postMessage(request);
  }
}

export default WorkerApi;
