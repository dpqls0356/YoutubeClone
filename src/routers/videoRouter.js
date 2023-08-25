import { Router } from "express";
import {getUpload,postUpload,getWatch} from "../controller/videoController";
import { videoUpload } from "../middleware";
const videoRouter = Router();

videoRouter.route("/:id([0-9a-f]{24})").get(getWatch);
videoRouter.route("/upload").get(getUpload).post(videoUpload.fields([
    {name:"video",maxCount:1},
    {name:"thumb",maxCount:1}
]),postUpload);

export default videoRouter;