import express from "express";
import { home,search } from "../controllers/videoController";
import { getLogin,postLogin,getJoin,postJoin, } from "../controllers/userController";
import { publicOnlyMiddleware } from "../middle";

const globalRouter = express.Router();

globalRouter.get("/",home);
globalRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin); 
globalRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
globalRouter.get("/search",search);
export default globalRouter;