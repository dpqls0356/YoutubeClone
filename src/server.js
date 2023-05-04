import express, { urlencoded } from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middle";
const app = express();
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views",process.cwd()+'/src/views');
app.use(express.urlencoded({ extended: true }));

app.use(logger);
// 세션 id를 express가 자동으로 만들어 브라우저에 보냄
// 쿠키에 세션 id를 넣어 다음 방문때 그 id를 보여줌
app.use(
    session({
    secret:"hello",
    resave:true,
    saveUninitialized:true,
    })
);

// app.use((req,res,next)=>{
//     console.log("===================================================");
//     req.sessionStore.all((error,sessions)=>{
//         console.log(sessions);
//         next();
//     })
// });
app.use(localsMiddleware);
app.use("/",rootRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);

export default app;