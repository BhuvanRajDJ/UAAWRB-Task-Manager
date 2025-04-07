const express = require("express");
const bodyParser = require("body-parser");
const UserRouter = require("./routes/UserRouter");
const path = require("path");
require("dotenv").config();
require("./models/db");
const PORT = process.env.PORT;
const app = express();
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


app.use('/', UserRouter);


app.listen(PORT, ()=>{
    console.log(`The Server is running on the port http://localhost:${PORT}` )
});