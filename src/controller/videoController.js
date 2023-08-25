import Video from "../models/videoModel";
export const getHome = async(req,res) =>{
    const videos = await Video.find({}).populate("owner");
    console.log(videos);
    return res.render("home",{videos}); 
}
export const getUpload = (req,res) =>{
    return res.render("video/upload");
}
export const postUpload = async(req,res)=>{
    const {title,description,hashtag} =req.body;
    const user = req.session.user;
    const video = req.files.video[0];
    const thumb = req.files.thumb[0];
    try{
        await Video.create({
            videoUrl:video.path,
            thumbUrl:thumb.path,
            owner:user._id,
            title:title,
            description:description,
            hashtag:Video.formatHashtags(hashtag),
        })
        return res.redirect("/");
    }
    catch(e){
        res.status(400).render("video/upload");
    }
}
export const getWatch = async(req,res)=>{
    const video = await Video.findById({_id:req.params.id});
    return res.render("watch",{video});
}
// multer설치
// form을 multipart로 변경 form에 enctype="multipart/form-data"추가하기 
// 미들웨어 코드 작성
// 라우터에 코드 작성 
// 폴더에 접근이 안되기에 static files serving시켜줄 것
//  1) /uploads 주소에 대한 코드 작성
//  2) app.use("/uploads",express.static("upload"));