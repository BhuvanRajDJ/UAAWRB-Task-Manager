const { response } = require("express");
const TasksModel = require("../models/taskModel");
const UserModel = require("../models/UserModel");

const fetchTask = async (req, res) => {
  const userDetails = req.user.id;
  const name = req.user.userName
  const email = req.user.email
  try {
    const usertasks = await TasksModel.find({ userDetails:userDetails }).populate("userDetails", "_id email userName dateOfBirth");

    res
      .status(200)
      .render("userDashboard", { name, email, usertasks, message: "", error: "" });
    // console.log(usertasks);
    // console.log(userDetails);
  } catch (error) {
    res.status(500).render("error", {
      error: `Couldn't fetch the task an error occured 
      ${error.message}`,
      message: "",
    });
  }
};

const createTask = async (req, res) => {
  const { taskName, taskDescription, taskDueDate, priority } = req.body;
  const userId = req.user.id;
  // console.log(`userID: ${userId}`);
  try {
    const task = new TasksModel({
      taskName,
      taskDescription,
      taskDueDate,
      priority,
      completed: false,
      userDetails: userId,
    });
    await task.save();
    const usertasks = await TasksModel.find({ userDetails: userId });
    // console.log("usertasks: ",usertasks);
    res.status(201).redirect("/user/dashboard");
  } catch (error) {
    res.status(500).render("error", {
      error: `Could not Create the tasks. An error occured: ${error}`,
      message: "",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const userDetails = req.user.id;
    const body = req.body;
    const obj = { $set: { ...body } };

    const task = await TasksModel.findOne({ _id: id });

    if (!task) {
      return res
        .status(404)
        .render("error", {
          message: "task not found",
          error: "",
          sucess: false,
        });
    }

    const data = await TasksModel.findByIdAndUpdate(id, obj, { new: true });
    res.status(200).redirect("/user/dashboard");
  } catch (error) {
    res.status(500).render("error", {
      message: "Failed to update the task",
      error: `${error}`,
      success: false,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const userDetails = req.user.id;
    // console.log("delete_id:", id);

    const data = await TasksModel.findByIdAndDelete(id);
    if (!data) {
      return res
        .status(400)
        .json({ message: "No task found to delete", success: false });
    }
    const usertasks = await TasksModel.find({ userDetails });
    // res
    //   .status(200)
    //   .render("userDashboard", { usertasks, message: "", error: "" });
    res
      .status(200)
      .json({ message: "Task deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(500)
      .json({ message: "Failed to delete the task", success: false });
  }
};

const fetchAllTasks = async (req, res) => {
  try {
    const AllUserTasks = await TasksModel.find({});
    const Name = req.user.userName;
    const Email = req.user.email;

    const allusers = await UserModel.find({});

    const allusersdatas = await TasksModel.find().populate(
      "userDetails",
      "_id email userName dateOfBirth age"
    );
    const allusersdata = allusersdatas.filter((item) => {
      return item.userDetails && item.userDetails.userName;
    });
    res.status(200).render("adminDashboard", { Name, Email, allusersdata, message: "" });
  } catch (error) {
    res
      .status(500)
      .render("error", {
        message: "Failed to fetch the tasks",
        error: error.message,
      });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const allUsers = await UserModel.deleteOne({ _id: id });
    if (allUsers.deleteCount === 0) {
      return res.status(400).json({
        message: "No users found",
        success: false,
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const deleteUserTask = async (req, res) => {
  const id = req.params.id;
  try {
    const deletetasks = await TasksModel.deleteOne({ _id: id });
    if (deletetasks.deletedCount == 0) {
      return response.json({
        message: "No tasks found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Task deleted succussfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const updateUserTask = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const obj = { $set: { ...body } };
    const task = await TasksModel.findOne({ _id: id });
    if (!task) {
      return res
        .status(404)
        .render("error", {
          message: "task not found",
          error: "",
          sucess: false,
        });
    }

    const data = await TasksModel.findByIdAndUpdate(id, obj, { new: true });
    res.status(200).json({
      message: "Task Updated Successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const filterTasks = async (req, res) => {
  try {
    const Name = req.user.userName;
    const Email = req.user.email;
    const { userName, priority, completed } = req.body;
    const allDetails = await TasksModel.find({}).populate(
      "userDetails",
      "email userName dateOfBirth age"
    );

    const allusersdata = allDetails.filter((item) => {
      const user = item.userDetails && item.userDetails.userName;
      return (
        (!userName || (user && user.toLowerCase() == userName.toLowerCase())) &&
        (!priority || item.priority == priority) &&
        (!completed || item.completed == (completed === "true"))
      );
    });

    res.status(200).render("adminDashboard", { Name, Email, allusersdata, message: "" });
  } catch (error) {
    res.render("error", {
      message: "Internal Server Error",
      error: error.message,
    });
    // res.status(500).json({message:"Internal Server Error", error:`${error}`});
  }
};

module.exports = {
  createTask,
  fetchTask,
  updateTask,
  deleteTask,
  fetchAllTasks,
  deleteUser,
  deleteUserTask,
  updateUserTask,
  filterTasks,
};
