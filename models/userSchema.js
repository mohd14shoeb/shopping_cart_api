const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  name: {
    type: String,
    required: [true, "name is required..."]
  },

  email: {
    type: String,
    unique: true,
    required: [true, "email is required..."]
  },

  username: {
    type: String,
    unique: true,
    required: [true, "username is required..."]
  },

  password: {
    type: String,
    unique: true,
    required: [true, "password is required..."]
  },

  createdItem: [
    {
      type: Schema.Types.ObjectId,
      ref: "Items"
    }
  ],

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Users", userSchema);
