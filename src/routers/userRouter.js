import { Router } from "express";
import {getLogout,startGithubLogin,finishGithubLogin,startKakaoLogin,finishKakaoLogin} from "../controller/userController";
const userRouter = Router();

userRouter.get("/github/start",startGithubLogin);
userRouter.get("/github/finish",finishGithubLogin);
userRouter.get("/kakao/start",startKakaoLogin);
userRouter.get("/kakao/finish",finishKakaoLogin)
userRouter.get("/logout",getLogout);
export default userRouter;