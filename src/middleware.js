import multer from "multer";

export const localsMiddleware=(req,res,next)=>{
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    if (res.locals.loggedIn){
        res.locals.user= req.session.user;
    }
    next();
}
export const videoUpload = multer(
    //사용자가 보낸 파일을 업로드 파일에 넣음
    {
        dest:"upload/videos/",
        limits:{
            fileSize:10000000000,
        }
    }
)