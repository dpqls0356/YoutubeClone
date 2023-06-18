import { Router } from "express";
import {getHome} from "../controller/videoController";

const rootRouter = Router();
rootRouter.get("/",getHome);

export default rootRouter;