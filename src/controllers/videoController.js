import Video from "../models/video";
import User from "../models/user";
import Comment from "../models/Comment";
// import { formatHashtags } from "../models/video";
export const home = async(req,res) =>{
    // asc - 오름차순 가장 오래된 것이 먼저 나옴  // desc - 내림차순 최신순
    const videos = await Video.find().sort({createdAt:"asc"}).populate("owner");
    return res.render("home",{pageTitle:"Home",videos});
}
export const getEdit =async(req,res)=>{
    const {id} = req.params;
    const video = await Video.findById(id);
    const user = req.session.user;
    if(String(user._id)!==String(video.owner)){
        req.flash("error","Not authorized");
        return res.status(403).redirect("/");
    }
    return res.render("videos/videoEdit",{pageTitle:`Edit ${video.title}`,video});
}
export const postEdit = async(req,res)=>{
    const {id} = req.params;
    const {title,description,hashtags} = req.body;
    const video =await Video.findById({_id:id});
    const user = req.session.user;
    if(String(user._id)!==String(video.owner)){
        return res.status(403).redirect("/");
    }
    if(!(await Video.exists({_id:id}))){
        return res.status(404).render("404",{pageTitle:"video not found", });
    }
    // 하나하나 대입해서 save()해도 상관없음
    try{
        await Video.findByIdAndUpdate(id,{title,description,hashtags:Video.formatHashtags(hashtags),});
        return res.redirect(`/videos/${id}`);
    }
    catch(error){
        console.log(error+"!!!");
    }

}
export const watch=async(req,res)=>{
    const {id} = req.params;
    // const id = req.params;
    const video = await Video.findById(id).populate("owner");
    if(!video){
        return res.status(404).render("404",{pageTitle:"video not found", });
    }
    return res.render("videos/watch",{pageTitle:video.title ,video});
    // const maker = await User.findById(video.owner);
    // return res.render("videos/watch",{pageTitle:video.title ,video,maker});
};
export const search=async(req,res)=>{
    // keyword를 {}로 감싸지않으면 오류남
    const {keyword} = req.query;
    var videos=[];
    if(keyword){
        videos = await Video.find({ 
            title: {
            //mongoDB의 검색엔진덕분! 
            // keyword를 포함한 데이터 ( i = 대소문자 구분 안함 )
                $regex:new RegExp(`${keyword}`,"i"),
            //    keyword로 시작하는 제목을 가진 데이터     
            //    $regex:new RegExp(`^${keyword}`,"i"),

            //    keyword로 끝나는 제목을 가진 데이터     
            //    $regex:new RegExp(`${keyword}$`,"i"),

            //    $gt:a a보다 큰 수
            },
        });
    }
    return res.render("videos/search",{pageTitle:"Search",videos});

}
export const getUpload=(req,res)=>{
    return res.render("videos/upload",{pageTitle:"Upload",});
}
export const postUpload=async(req,res)=>{
    const {_id}= req.session.user;
    const {title,description, hashtags} = req.body;
    const file = req.files.video[0];
    const thumb = req.files.thumbnail[0];
    // const video = new Video({
    //     title: title,
    //     desrciption: description,
    //     createdAt: Date.now(),
    //     hashtags:hashtags.split(",").map(word=>`#${word}`),
    //     meta:{
    //     views:0,
    //     rating:0,
    //     }
    // })
    // save -> save 작업이 끝날 때까지 기다려함  (doc을 return)
    // await video.save();
    try{
        const newVideo = await Video.create({
            owner:_id,
            fileUrl:file.path,
            thumbUrl:thumb.path,
            title: title,
            description: description,
            hashtags:Video.formatHashtags(hashtags),
            });
        const user= await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        res.redirect("/");
    }
    catch(error){
        console.log(error);
        res.status(400).render("videos/upload",{pageTitle:"Upload Video",errorMessage:error._message});
    }
}
export const deleteVideo=async(req,res)=>{
    const {id}= req.params;
    const video = await Video.findById(id).populate("owner");
    const user = await User.findById((video.owner._id));
    console.log(user);
    if(String(user._id)!==String(video.owner._id)){
        req.flash("error","Not authorized");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    user.videos.splice(user.videos.indexOf(id),1);
    user.save();
    // findOneAndDelete({_id:id})줄여쓴 것
    return res.redirect("/");
}

export const registerView = async(req,res) =>{
    const {id} = req.params;
    const video = await Video.findById(id);
    if(video){
        video.meta.views= video.meta.views+1;
        await video.save();
        return res.sendStatus(200);
    }
    else{
        return res.sendStatus(404);
    }
}
export const addComment = async(req,res) =>{
    // request를 보내면서 쿠키를 보내기에 session에 접근 가능
    const videoId = req.params.id;
    const user = req.session.user;
    const comment = req.body.comment;

    const video = await Video.findById(videoId).populate("comments").populate("owner");

    if(!video){
        return res.sendStatus(404);
    }
    const commentDB = await Comment.create({
        text : comment,
        owner:user._id,
        video:videoId,
    })
    video.comments.push(commentDB._id);
    video.save();
console.log(video.comments);
    return res.sendStatus(201);
}