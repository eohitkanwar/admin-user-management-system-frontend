const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
    min: 18,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    min: 4,
  },
  token: {
    type: Object,
  },
});
const users = mongoose.model("user", user);

module.exports = users;
