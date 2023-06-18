import "dotenv/config";
import express from "express";
import morgan from "morgan";
import "./db.js";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";

const PORT = "4000";
const app = express();
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views",process.cwd()+"/src/views");
app.use(express.urlencoded({extended:true}))


const handleOpneServer = (req,res,next) =>{
    console.log(`🤖Sever listening on port http://localhost:${PORT}`);
}

app.use(logger);
app.use("/assets",express.static("assets"));
app.use("/",rootRouter);
app.use("/users",userRouter);
app.use("/videos",videoRouter);
app.listen(PORT,handleOpneServer);