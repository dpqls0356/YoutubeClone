import express from "express";
import { getEdit,postEdit,see,deleteUser,startGithubLogin,finishGithubLogin,logout,getChangePw,postChangePw ,getProfile} from "../controllers/userController";
import { avatarUpload, protectorMiddleware,publicOnlyMiddleware, uploadFiles } from "../middle";

const userRouter = express.Router();


userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"),postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePw).post(postChangePw);
userRouter.get("/delete",deleteUser);
userRouter.get("/github/start",publicOnlyMiddleware,startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware,finishGithubLogin);
userRouter.get("/logout",protectorMiddleware,logout);
userRouter.route("/:id").get(getProfile);
export default userRouter;