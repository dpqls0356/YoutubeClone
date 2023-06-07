import multer from "multer";

export const localsMiddleware = (req,res,next)=>{
    // console.log("===================================================");
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.user = req.session.user ||{};
    // console.log(res.locals.user);
    next();
}
// 로그인
export const protectorMiddleware = (req,res,next) =>{
    if(req.session.loggedIn){
        return next();   
    }    
    else{
        req.flash("error","Not authorized");
        return res.redirect("/login");
    }
}
// 비로그인
export const publicOnlyMiddleware = (req,res,next)=>{
    if(req.session.loggedIn){
        req.flash("error","Not authorized");
        return res.redirect("/");
    }
    else{
        return next();
    }
}
// 사용자가 보낸 파일을 uploads 폴더에 저장
export const avatarUpload = multer({ dest: "uploads/avatars/",limits:{
    fileSize:10000000,
}});

export const videoUpload = multer({dest:"uploads/videos/",limits:{
    fileSize:10000000,

}});