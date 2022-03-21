'use strict';

const { UserService } = require('../services/userService');

class UserController {
  async create(req, res) {
    try {
      const data = req.body;

      const response = await UserService.checkUserExisting(data);
      const { username, email } = response;
      const isUserExist = !(username === null && email === null);

      if (isUserExist) {
        if (username && email) {
          res.status(210).json(`User already exists!`);
          return;
        }

        if (username) {
          res.status(210).json(`${data.username} already exists!`);
          return;
        }

        if (email) {
          res.status(210).json(`${data.email} already exists!`);
          return;
        }
      }

      const user = await UserService.create(data);
      const filtred = {
        username: user.username,
        email: user.email,
        __v: user.__v,
        _id: user._id,
      };
      res.json(filtred);
    } catch (e) {
      res.status(500).json('500: create() failed');
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const doesExist = await UserService.checkUsernameExisting(username);
      if (!doesExist) {
        return res.json(null);
      }

      const response = await UserService.login({ username, password });

      return res.json(response);
    } catch (e) {
      res.status(500).json('500: login() failed');
    }
  }

  async getUsers(req, res) {
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async updateProfile(req, res) {
    try {
      const response = await UserService.updateProfile(req.body);
      const {
        _id,
        firstmame,
        lastname,
        patronymic,
        question,
        answer,
      } = response;
      return res.json({
        _id,
        firstmame,
        lastname,
        patronymic,
      });
    } catch (e) {
      console.log(e)
      res.status(500).json(e.message);
    }
  }

  async getRestoreData(req, res) {
    try {
      const response = await UserService.getRestoreData(req.body);
      res.json(response);
    } catch (e) {
      res.status(500).json(e.message);
    }

  }

  async getQuestion(req, res) {
    try {
      const response = await UserService.getQuestion(req.query);
      res.json(response);
    } catch (e) {
      res.status(500).json(e);
    }

  }
}

module.exports = {
  UserController: new UserController(),
}