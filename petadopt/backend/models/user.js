// models/user.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ['Erkek', 'Kadın', 'Diğer'] },
  age: { type: Number },
  occupation: { type: String },
  phone: { type: String },
  profilePhoto: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
