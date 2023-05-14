import express from "express";
import { watch,getEdit,postEdit,getUpload,postUpload,deleteVideo } from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middle";
import { uploadFiles } from "../middle";

const videoRouter = express.Router();

// 24byte 16진수데이터가 들어옴 : id
videoRouter.get("/:id([0-9a-f]{24})",watch);
// videoRouter.get("/:id/edit",getEdit);
// videoRouter.post("/:id/edit",postEdit);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete",protectorMiddleware,deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.single("video"),postUpload);
export default videoRouter