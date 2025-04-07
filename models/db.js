const mongoose = require("mongoose");
require("dotenv").config();
const DB_URL = process.env.Mongodb_URL;


async function connection(){
    try{
        await mongoose.connect(DB_URL);
        console.log("MongoDB connection Established.");
    }catch(error){
        console.log("Mongodb connection could'nt be established.", error)
    }
}

connection();


