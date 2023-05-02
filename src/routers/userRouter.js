import express from "express";
import { edit,see,deleteUser, } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)",see);
userRouter.get("/edit",edit);
userRouter.get("/delete",deleteUser);

export default userRouter;