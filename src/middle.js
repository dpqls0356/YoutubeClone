import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
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
// export const avatarUpload = multer({ dest: "uploads/avatars/",limits:{
//     fileSize:10000000,
// }});

// export const videoUpload = multer({dest:"uploads/videos/",limits:{
//     fileSize:10000000,

// }});
const isfly = process.env.NODE_ENV ==="production";
const s3 =  new S3Client({
    region: "ap-northeast-2",
    credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    },
});

const s3ImageUploader = multerS3({
    s3:s3,
    bucket: 'youtube-clone-v1',
    acl:'public-read',
    key: function (request, file, ab_callback) {
        const newFileName = Date.now() + "-" + file.originalname;
        const fullPath = "images/" + newFileName;
        ab_callback(null, fullPath);
        },
})
const s3VideoUploader = multerS3({
    s3:s3,
    bucket: 'youtube-clone-v1',
    acl:'public-read',
    key: function (request, file, ab_callback) {
        const newFileName = Date.now() + "-" + file.originalname;
        const fullPath = "videos/" + newFileName;
        ab_callback(null, fullPath);
        },
})
export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits:{
        fileSize:10000000
        },
    storage: isfly? s3ImageUploader:undefined,
    },
);

export const videoUpload = multer({
    dest:"uploads/videos/",
    limits:{
        fileSize:10000000},
    storage: isfly? s3VideoUploader:undefined,
    }
);