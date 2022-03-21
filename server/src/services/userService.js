'use strict';

const { UserSchema } = require('../schemes/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, secret, { expiresIn: '12h' });
};

class UserService {
  async create(data) {
    const { password } = data;
    const hashPassword = bcryptjs.hashSync(password, 7);
    const createdUser = await UserSchema.create({
      password: hashPassword,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
    });
    return createdUser;
  }

  async checkUserExisting(data) {
    const res1 = await UserSchema.findOne({ username: data.username.toLowerCase() });
    const res2 = await UserSchema.findOne({ email: data.email.toLowerCase() });

    return {
      username: res1 !== null,
      email: res2 !== null,
    };
  }

  async login({ username, password }) {
    const res = await UserSchema.findOne({ username: username.toLowerCase() });
    const validPassword = bcryptjs.compareSync(password, res.password);

    if (!validPassword) return false;

    const token = generateAccessToken(res._id);

    return {
      token,
      _id: res._id,
      firstname: res.firstname,
      lastname: res.lastname,
      patronymic: res.patronymic,
      answer: res.answer,
      question: res.question,
    };
  }

  async checkUsernameExisting(username) {
    const res = await UserSchema.findOne({ username: username.toLowerCase() });
    return res !== null;
  }

  async getUsers() {
    const res = await UserSchema.find();
    return res;
  }

  async updateProfile(user) {
    const res = await UserSchema.findByIdAndUpdate(user._id, user);
    return res;
  }

  async getRestoreData(data) {
    try {
      const res = await UserSchema.find({ username: data.username });

      if (res.length) {
        if (data.answer.trim() === res[0].answer.trim()) {
          const newPassword = bcryptjs.hashSync(data.password, 7);
          const res2 = await UserSchema.findByIdAndUpdate(res[0]._id, { ...res, password: newPassword })
          return res2;
        }
      }

      return null;
    } catch (e) {
      console.log(e);
    }
  }

  async getQuestion(username) {
    const res = await UserSchema.find(username);
    if (res.length) {
      return res[0].question;
    }

    return null;
  }
}

module.exports = {
  UserService: new UserService(),
}