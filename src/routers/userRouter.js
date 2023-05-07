import express from "express";
import { getEdit,postEdit,see,deleteUser,startGithubLogin,finishGithubLogin,logout } from "../controllers/userController";
import { protectorMiddleware,publicOnlyMiddleware } from "../middle";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)",see);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/delete",deleteUser);
userRouter.get("/github/start",publicOnlyMiddleware,startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware,finishGithubLogin);
userRouter.get("/logout",protectorMiddleware,logout);
export default userRouter;