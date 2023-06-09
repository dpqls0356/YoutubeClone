
import express, { urlencoded } from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middle";
import apiRouter from "./routers/apiRouter";
const app = express();
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views",process.cwd()+'/src/views');

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Embedder-Policy", "credentialless");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });
// 이 미들웨어 덕분에 form 통해 오는 데이터를 서버가 이해
app.use(express.urlencoded({ extended: true }));
// feach로 들어오는 text 데이터 이해를 위함
app.use(express.text({extneds:true}));
// feach로 들어오는 json 데이터 이해를 위함 - > string을 json화 해줌
app.use(express.json());

app.use(logger);
// 세션 id를 express가 자동으로 만들어 브라우저에 보냄
// 쿠키에 세션 id를 넣어 다음 방문때 그 id를 보여줌
app.use(
    session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    // 서버의 세션을 서버 메모리가 아니라 DB에 저장 시켜 세션의 내용을 영구적으로 기억하도록함
    store:MongoStore.create({mongoUrl:process.env.DB_URL}),
    cookie:{
    }
    })
);
app.use(flash());
// app.use((req,res,next)=>{
//     console.log("===================================================");
//     req.sessionStore.all((error,sessions)=>{
//         console.log(sessions);
//         next();
//     })
// });
app.use(localsMiddleware);
// url는 자유롭게 써도 되나 static의 값은 폴더명으로 들어가야한다.
app.use("/assets",express.static("assets"));
app.use("/uploads",express.static("uploads"));
app.use("/",rootRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);
app.use("/api",apiRouter);
export default app;