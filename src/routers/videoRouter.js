import express from "express";
import { watch,getEdit,postEdit,getUpload,postUpload,deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();

// 24byte 16진수데이터가 들어옴 : id
videoRouter.get("/:id([0-9a-f]{24})",watch);
// videoRouter.get("/:id/edit",getEdit);
// videoRouter.post("/:id/edit",postEdit);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete",deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);
export default videoRouter