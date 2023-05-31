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
// 파일을 받고 req.file를 통해 사용 가능하다
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.fields([
    {name:"video",maxCount:1},
    {name:"thumbnail",maxCount:1},
]),postUpload);
export default videoRouter