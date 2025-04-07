const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModel = require("./UserModel");

const TasksSchema = new Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  taskDueDate: { type: Date, required: true },
  priority: { type: String, required: true },
  completed: { type: Boolean, default: false, required: true },
  userDetails: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const TasksModel = mongoose.model("tasks", TasksSchema);
module.exports = TasksModel;
