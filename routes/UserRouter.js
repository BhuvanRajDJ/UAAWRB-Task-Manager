const router = require("express").Router();
const {
  createUser,
  signinuser,
  loginAdmin,
  authenticationToken,
  adminAuthenticationToken,
  userLoginpage,
  userSignUpPage,
  loginAdminpage,
  logOut, 
  adminLogOut
} = require("../controllers/UserController");
const {
  createTask,
  fetchTask,
  updateTask,
  deleteTask,
  fetchAllTasks,
  deleteUser,
  deleteUserTask,
  updateUserTask,
  filterTasks
  
} = require("../controllers/taskController");

router.post("/register", createUser);
router.get("/register", userSignUpPage);
router.post("/", signinuser);
router.get("/", userLoginpage);
router.post("/adminlogin", loginAdmin);
router.get("/adminlogin", loginAdminpage);

router.post("/user/dashboard", authenticationToken, createTask);
router.get("/user/dashboard", authenticationToken, fetchTask);
router.put("/user/dashboard/:id", authenticationToken, updateTask);
router.patch("/user/dashboard/:id", authenticationToken, updateTask);
router.delete("/user/dashboard/:id", authenticationToken, deleteTask);
router.get("/user/logout", authenticationToken, logOut);

router.get("/admin/dashboard", adminAuthenticationToken, fetchAllTasks);
router.post("/admin/dashboard/filter", adminAuthenticationToken, filterTasks);
router.delete("/admin/dashboard/:id", adminAuthenticationToken, deleteUserTask);
router.delete("/admin/dashboard/deleteUser/:id",adminAuthenticationToken, deleteUser);
router.put("/admin/dashboard/:id",adminAuthenticationToken,updateUserTask)
router.get("/admin/logout", adminLogOut);


module.exports = router;