'use strict';

const { Router } = require('express');
const TasksController = require('./controllers/tasksController');
const { UserController } = require('./controllers/userController');
const authMiddleware = require('./middlewares/authMiddleware');

const router = new Router();

router.post('/reg', UserController.create);
router.post('/login', UserController.login);
router.get('/users', authMiddleware, UserController.getUsers);
router.post('/profile', authMiddleware, UserController.updateProfile);
router.post('/restore', UserController.getRestoreData);
router.get('/restore', UserController.getQuestion);
router.post('/tasks', TasksController.addTask);
router.get('/tasks', TasksController.getTasks);
router.delete('/tasks/:id', TasksController.deleteTask);
router.put('/tasks/', TasksController.editTask);

module.exports = {
  router,
};