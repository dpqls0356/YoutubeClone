import "dotenv/config";
import express from "express";
import morgan from "morgan";
import session from "express-session";
import "./db.js";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import { localsMiddleware } from "./middleware.js";

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

app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:true,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.DB_URL
    })
}))
// app.use("/",(req,res,next)=>{
//     console.log(req.session);
//     next();
// })

// 세션과 관련된 코드보다 뒤에 와야 세션값을 받을 수 있음
app.use(localsMiddleware);
app.use("/",rootRouter);
app.use("/users",userRouter);
app.use("/videos",videoRouter);
app.listen(PORT,handleOpneServer);