import express from "express";
import { edit,see,deleteUser,startGithubLogin } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)",see);
userRouter.get("/edit",edit);
userRouter.get("/delete",deleteUser);
userRouter.get("/github/start",startGithubLogin);

export default userRouter;