import express from "express";
import { edit,see,deleteUser,startGithubLogin,finishGithubLogin } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)",see);
userRouter.get("/edit",edit);
userRouter.get("/delete",deleteUser);
userRouter.get("/github/start",startGithubLogin);
userRouter.get("/github/finish",finishGithubLogin);

export default userRouter;