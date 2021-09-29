const mongoose = require("mongoose");
const { Schema } = mongoose;

// Set up mongo user schema
const userSchema = new Schema({
  username: String,
  _id: String,
  logs: [Object],
});

// Create user model
const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;
