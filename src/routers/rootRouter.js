import express from "express";
import { home,search } from "../controllers/videoController";
import { getLogin,postLogin,getJoin,postJoin,logout } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/",home);
globalRouter.route("/join").get(getJoin).post(postJoin); 
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.get("/logout",logout);
globalRouter.get("/search",search);
export default globalRouter;