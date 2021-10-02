const mongoose = require("mongoose");
const { Schema } = mongoose;

// Set up mongo user schema
const fileSchema = new Schema({
  contentType: String,
  image: Object,
});

// Create user model
const fileModel = new mongoose.model("files", fileSchema);

module.exports = fileModel;
