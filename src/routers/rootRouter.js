import { Router } from "express";
import {getHome} from "../controller/videoController";
import {getJoin,getLogin} from "../controller/userController";
const rootRouter = Router();

rootRouter.get("/",getHome);
rootRouter.route("/join").get(getJoin);
rootRouter.route("/login").get(getLogin);

export default rootRouter;