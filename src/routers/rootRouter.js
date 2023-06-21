import { Router } from "express";
import {getHome} from "../controller/videoController";
import {getJoin} from "../controller/userController";
const rootRouter = Router();

rootRouter.get("/",getHome);
rootRouter.route("/join").get(getJoin);

export default rootRouter;