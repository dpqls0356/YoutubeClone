import mongoose from "mongoose";
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on("errer",(error)=>console.log(`DB Error`));
db.once("open",()=>console.log("Connected DB"));