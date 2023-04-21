import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/youtubeClone");

const db = mongoose.connection;
db.on("errer",(error)=>console.log(`DB Error`));
db.once("open",()=>console.log("Connected DB"));