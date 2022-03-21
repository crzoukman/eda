'use strict';

const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  firstname: String,
  lastname: String,
  patronymic: String,
  question: String,
  answer: String,
});

module.exports = {
  UserSchema: mongoose.model('userSchema', user),
};