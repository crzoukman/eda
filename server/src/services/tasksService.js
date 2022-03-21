'use strict';

const { TasksSchema } = require("../schemes/tasks");

class TasksService {
  static async addTask(data) {
    try {
      const res = await TasksSchema.create(data);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }

  static async getTasks(id) {
    try {
      const res = await TasksSchema.find({ userId: id });
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }

  static async deleteTask(id) {
    try {
      const res = await TasksSchema.findByIdAndDelete(id);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }

  static async editTask(task) {
    try {
      const res = await TasksSchema.findByIdAndUpdate(task._id, task);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = TasksService;