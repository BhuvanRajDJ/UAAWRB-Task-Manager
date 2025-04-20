const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { response } = require("express");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const AdminEmail = process.env.AdminEmail;
const AdminPassword = process.env.AdminPassword;
const AdminId = process.env.AdminId;
const AdminName = process.env.AdminName;
const ROLE = process.env.ROLE;

const createUser = async (req, res) => {
  const {
    userRole,
    dateOfBirth,
    userName,
    email,
    password,
    confirmpassword,
  } = req.body;
  try {
    const existinguser = await UserModel.findOne({ email });

    if (email == AdminEmail) {
      return res.status(400).render("signup", {message:"User already exists, try another email."});
    } else if (existinguser) {
      return res.status(400).render("signup", {message:"User already exists, try another email."});
    }

    if (password !== confirmpassword) {
      return res
        .status(400).render("signup", {message:"Password does not match"});
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      userName,
      email,
      password: hashedpassword,
      userRole,
      dateOfBirth,
    });    
    await user.save();
    res.status(201).redirect("/");
  } catch (error) {
    res.status(500).render("error",{
      message: "Failed to Create a user",
      error: `${error}`,
    });
  }
};

const userSignUpPage = async (req, res) =>{
  try{

    await res.status(200).render("signup", {message:""})
  }catch(error){
    res.status(500).render("signup", {message:"Internal server error"})
  }
}

const signinuser = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).render("index", {message: "User does not exists"});
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).render("index",{message:"Password does not match"});
    }
    const token = jwt.sign(
      { email: email, id: user._id, userName: user.userName, role: "user" },
      SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.cookie("token", token, {httpOnly:true, secure:true});
  return  res
      .status(200).redirect("/user/dashboard");
  } catch (error) {
    res
      .status(500)
      .render("index",{ message: `Failed to Login. an error occured :${error}`});
  }
};

const userLoginpage = async (req, res) => {
  try{
    res.status(200).render("index",{message:""});
  }
  catch(error){
    res.status(500).render("index", {message:"Internal Server Error"})
  }
}

const logOut = async (req, res) => {
  try{
    res.clearCookie("token");
    res.status(200).send("logged_Out");
    
  }catch(error){
    res.status(500).render("error", {
      error:`Couldn't log out an error occured ${error.message}`,
      message:""
    })
  }
}

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === AdminEmail && password === AdminPassword) {
      const token = jwt.sign(
        { email: AdminEmail, id: AdminId, userName: AdminName, role:ROLE },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      res.cookie("adminToken", token, {httpOnly:true, secure:true});

      return res
        .status(200)
        .redirect("/admin/dashboard");
    }
    else{
      res.status(400).render("adminLogin",{message:"Admin could't log in. check your email and password once again"});
    }
  } catch (error) {
    res.status(500).render("adminLogin",{ Message: `Internal Server Error, Error:${error}` });
  }
};

const loginAdminpage = async (req, res) => {
  try{
    res.status(200).render("adminLogin", {message:""});
  }catch(error){
    res.status(500).render("adminLogin", {message:`Internal server error, error:",${error.message}`})
  }
}

const adminLogOut = async (req, res) => {
  try{
    res.clearCookie("adminToken");
    res.status(200).send("logged_Out");
  }catch(error){
    res.status(500).render("error", {
      error:`Couldn't log out an error occured ${error.message}`,
      message:""
    })
  }
}

const authenticationToken = async (req, res, next) => {
  // const token = req.headers["authorization"];
  const token = req.cookies.token;
  // console.log("token:", token );
  if (!token) {
    return res
      .status(401)
      .render("error",{ error: "Access denied, no token provided" , message:""});
  }
  // const token1 = token.split("Bearer ")[1]
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).render("error", {error:"Invalid token", message:""});
    }
    req.user = user;
    next();
  });
}

const adminAuthenticationToken = async (req, res, next) => {
try{
  const token = req.cookies.adminToken;
  if(!token){
    res.status(404).render("error", {message:"", error:"No token found for the user, PLease login again"});
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if(err){
      return res.status(403).render("error", {error:"Invalid token", message:""});
    }
    req.user = user;
    next();
  });
}catch(error){
  res.status(500).json({
    message:"Internal server error",
    success:false,
    error:error.message
  })
}
}


module.exports = { createUser, signinuser, loginAdmin, authenticationToken, userLoginpage, userSignUpPage, loginAdminpage, adminAuthenticationToken, logOut, adminLogOut };
