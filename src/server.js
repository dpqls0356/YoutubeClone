import express from "express"
import morgan from "morgan"
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
// default export의 경우 변수명을 변경해도 상관없음
const PORT =4002;
const app =express();
const logger = morgan("dev");

app.use(logger);
app.use("/",globalRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);


const handlerListening = () =>{
    console.log(`someone come in  http://localhost:${PORT}`);
}
app.listen(PORT,handlerListening);
