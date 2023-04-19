import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
const app = express();
const logger = morgan("dev");
const PORT = 8000;

app.set("view engine","pug");
app.set("views",process.cwd()+'/src/views');
app.use(logger);
app.use("/",globalRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);
const severListeningHandle = (req,res,next) =>{
    console.log(`Sever listening on port http://localhost:${PORT}`);
}
app.listen(PORT, severListeningHandle);
// // default export의 경우 변수명을 변경해도 상관없음

