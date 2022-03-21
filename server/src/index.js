'use strict';

console.clear();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { router } = require('./router');

const PORT = 5000;
const DB_URL = 'mongodb+srv://zoukman:sunny1988@cluster0.bkavf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', router);

try {
  mongoose.connect(DB_URL);

  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
} catch (e) {
  console.error(e);
}
