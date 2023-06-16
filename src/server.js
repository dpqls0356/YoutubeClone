import express from "express";
import morgan from "morgan";
import "./db.js";
const PORT = "4000";
const app = express();
const logger = morgan("dev");

const handleOpneServer = (req,res,next) =>{
    console.log(`🤖Sever listening on port http://localhost:${PORT}`);
}
const getHome = (req,res,next) =>{
    res.send("hi");
}

app.use(logger);
app.get("/",getHome);
app.listen(PORT,handleOpneServer);