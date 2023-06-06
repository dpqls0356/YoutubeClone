import express from "express";
import {registerView,addComment,deleteComment} from "../controllers/videoController";
const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/views",registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment",addComment);
apiRouter.delete("/videos/:id/delete",deleteComment);
export default apiRouter;
