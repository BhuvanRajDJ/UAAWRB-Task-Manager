const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  password: {
  type: String,
  required: true,
  },
  confirmpassword: {
    type: String,
  },
  userRole: {
    type: String,
    required: true,
    default: "user",
    immutable: true,
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
