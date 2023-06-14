import express from "express";

const PORT = "3000";
const app = express();

const handleOpneServer = (req,res,next) =>{
    console.log(`🤖Sever listening on port http://localhost:${PORT}`);
}
const getHome = (req,res,next) =>{
    res.send("hi");
}

app.get("/",getHome);
app.listen(PORT,handleOpneServer);