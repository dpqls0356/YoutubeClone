import { Router } from "express";
import {getLogout,startGithubLogin,finishGithubLogin} from "../controller/userController";
const userRouter = Router();

userRouter.get("/github/start",startGithubLogin);
userRouter.get("/github/finish",finishGithubLogin);
userRouter.get("/logout",getLogout);
export default userRouter;