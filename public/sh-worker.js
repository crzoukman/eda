'use strict';

let users = [
  {
    username: 'fucker',
    password: 'qwerty123',
    email: 'fucker@mail.ru',
    firstname: 'fucker',
    lastname: '',
    patronymic: '',
    question: '',
    answer: '',
  },
  {
    username: 'slacker',
    password: 'qwerty123',
    email: 'slacker@mail.ru',
    firstname: 'slacker',
    lastname: '',
    patronymic: '',
    question: '',
    answer: '',
  },
];

let tasks = [
  {
    username: 'slacker',
    id: '800cd06b-ce36-459a-bd5c-060c9a9ba222',
    name: 'initial',
    added:
      'Sat Jul 09 2022 17:30:28 GMT+0300 (Moscow Standard Time)',
    type: 'Type 2',
    plannedEnd:
      'Sun Jul 31 2022 17:30:12 GMT+0300 (Moscow Standard Time)',
    plannedStart:
      'Mon Jul 11 2022 17:30:12 GMT+0300 (Moscow Standard Time)',
  },
];

const ports = [];

onconnect = function (ev) {
  const port = ev.ports[0];

  port.onmessage = (e) => {
    const message = e.data;

    if (message.type === 'login') {
      const isValid = checkCredentials(message, users);

      if (isValid) {
        const tokens = generateTokens(message.username);

        ports.forEach((p) =>
          p.postMessage({
            type: 'login',
            status: 201,
            response: tokens,
          }),
        );
      } else {
        ports.forEach((port) => {
          port.postMessage({
            type: 'login',
            response: false,
          });
        });
      }
    }

    if (message.type === 'getProfileData') {
      const data = message.request;

      const user = getUser(data);

      if (user) {
        ports.forEach((p) =>
          p.postMessage({
            type: 'getProfileData',
            response: user,
          }),
        );
      }
    }

    if (message.type === 'updateProfile') {
      const data = message.request;

      const filtred = users.filter(
        (user) => user.username !== data.username,
      );

      filtred.push({
        username: data.username,
        email: data.email,
        ...data.data,
      });

      users = filtred;

      const user = getUser({ username: data.username });

      ports.forEach((p) =>
        p.postMessage({
          type: 'updateProfile',
          response: user,
        }),
      );
    }

    if (message.type === 'getTasks') {
      const username = message.request.username;
      const filtred = tasks.filter((task) => {
        return task.username === username;
      });

      ports.forEach((p) =>
        p.postMessage({
          type: 'getTasks',
          response: filtred,
        }),
      );
    }

    if (message.type === 'addTask') {
      const username = message.request.username;
      tasks.push({ ...message.request.data, username });

      ports.forEach((p) =>
        p.postMessage({
          type: 'addTask',
          response: tasks,
        }),
      );
    }

    if (message.type === 'editTask') {
      const id = message.request.data.id;
      const newData = message.request.data;
      const task = getTask(id, tasks);
      const filtred = tasks.filter(
        (task) => task.id !== id,
      );
      const updatedTask = { ...task, ...newData };
      filtred.push(updatedTask);
      tasks = filtred;

      ports.forEach((p) =>
        p.postMessage({
          type: 'editTask',
          response: tasks,
        }),
      );
    }

    if (message.type === 'deleteTask') {
      const id = message.request.data;
      const filtred = tasks.filter(
        (task) => task.id !== id,
      );

      tasks = filtred;

      ports.forEach((p) =>
        p.postMessage({
          type: 'deleteTask',
          response: tasks,
        }),
      );
    }

    if (message.type === 'setTasks') {
      const newTasks = message.request.data;

      tasks = newTasks;

      ports.forEach((p) =>
        p.postMessage({
          type: 'setTasks',
          response: tasks,
        }),
      );
    }
  };

  port.start();
  ports.push(port);
};

function getTask(id, tasks) {
  const found = tasks.find((task) => task.id === id);
  return found;
}

function getUser(userData) {
  const found = users.find(
    (user) => user.username === userData.username,
  );

  return found;
}

function checkCredentials(userData, users) {
  const found = users.find(
    (user) => user.username === userData.username,
  );

  if (!found) return false;

  const password = found.password;

  if (password !== userData.password) return false;

  return found;
}

function generateTokens(username) {
  if (username === 'fucker') {
    return {
      access_token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImZ1Y2tlciIsImVtYWlsIjoiZnVja2VyQG1haWwucnUifQ.YDM2Xe3QL8cXXmXWbGxl8A_Otu_FrFixhg3G7kU6FFM',
      refresh_token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImZ1Y2tlciIsImVtYWlsIjoiZnVja2VyQG1haWwucnUifQ.YDM2Xe3QL8cXXmXWbGxl8A_Otu_FrFixhg3G7kU6FFM',
    };
  }

  if (username === 'slacker') {
    return {
      access_token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNsYWNrZXIiLCJlbWFpbCI6InNsYWNrZXJAbWFpbC5ydSJ9.tgulnbehDwAfNthc86GBA895Psjzrt6z9-y9TEEaJ6E',
      refresh_token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InNsYWNrZXIiLCJlbWFpbCI6InNsYWNrZXJAbWFpbC5ydSJ9.tgulnbehDwAfNthc86GBA895Psjzrt6z9-y9TEEaJ6E',
    };
  }
}
