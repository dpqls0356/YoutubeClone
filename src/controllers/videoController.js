import Video from "../models/video";
import { userObj } from "./userController";
// import { formatHashtags } from "../models/video";
export const home = async(req,res) =>{
    // asc - 오름차순 가장 오래된 것이 먼저 나옴  // desc - 내림차순 최신순
    const videos = await Video.find().sort({createdAt:"asc"});
    return res.render("home",{pageTitle:"Home",userObj:userObj,videos});
}
export const getEdit =async(req,res)=>{
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"video not found", userObj});

    }
    return res.render("edit",{pageTitle:`Edit ${video.title}`,userObj:userObj,video});
}
export const postEdit = async(req,res)=>{
    const {id} = req.params;
    const {title,description,hashtags} = req.body;
    // const video =await Video.exists({_id:id});
    if(!(await Video.exists({_id:id}))){
        return res.status(404).render("404",{pageTitle:"video not found", userObj});
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
    // const id = req.params
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"video not found", userObj});
    }
    return res.render("watch",{pageTitle:video.title ,userObj:userObj,video});
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
    console.log(videos); 
    return res.render("search",{pageTitle:"Search",userObj:userObj,videos});

}
export const getUpload=(req,res)=>{
    return res.render("upload",{pageTitle:"Upload",userObj:userObj,});
}
export const postUpload=async(req,res)=>{
    const {title,description, hashtags} = req.body;
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
        await Video.create({
            title: title,
            description: description,
            hashtags:Video.formatHashtags(hashtags),
            });
        res.redirect("/");
    }
    catch(error){
        console.log(error);
        res.status(400).render("upload",{pageTitle:"Upload Video",userObj,errorMessage:error._message});
    }
}
export const deleteVideo=async(req,res)=>{
    const {id}= req.params;
    console.log(id);
    await Video.findByIdAndDelete(id);
    // findOneAndDelete({_id:id})줄여쓴 것
    return res.redirect("/");
}