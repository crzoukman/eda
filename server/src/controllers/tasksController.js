const TasksService = require("../services/tasksService");

class TasksController {
  static async addTask(req, res) {
    try {
      const response = await TasksService.addTask(req.body);
      res.json(response);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async getTasks(req, res) {
    try {
      const response = await TasksService.getTasks(req.query.id);
      res.json(response);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async deleteTask(req, res) {
    try {
      const response = await TasksService.deleteTask(req.params.id);
      res.json(response);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async editTask(req, res) {
    try {
      const response = await TasksService.editTask(req.body);
      res.json(response);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = TasksController;