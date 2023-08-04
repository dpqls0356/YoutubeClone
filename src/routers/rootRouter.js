import { Router } from "express";
import {getHome} from "../controller/videoController";
import {getJoin,getLogin, postJoin,postLogin} from "../controller/userController";
const rootRouter = Router();

rootRouter.get("/",getHome);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);

export default rootRouter;