import express from "express";
import { edit } from "../controllers/userController";
import { deleteUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit",edit);
userRouter.get("/delete",deleteUser);
export default userRouter;