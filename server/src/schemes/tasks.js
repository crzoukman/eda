'use strict';

const mongoose = require('mongoose');

const tasks = new mongoose.Schema({
  userId: String,
  name: String,
  date: String,
  type: String,
  plannedStart: Date,
  plannedEnd: Date,
  completed: Boolean,
  started: Boolean,
  startedTime: Date,
  endedTime: Date,
});

module.exports = {
  TasksSchema: mongoose.model('tasksSchema', tasks),
};