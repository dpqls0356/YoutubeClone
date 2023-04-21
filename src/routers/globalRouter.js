import express from "express";
import { home } from "../controllers/videoController";
import { login,join } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/",home);
globalRouter.get("/join",join); 
globalRouter.get("/login",login);

export default globalRouter;