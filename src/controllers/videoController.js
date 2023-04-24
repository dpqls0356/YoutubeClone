import Video from "../models/video";
// import { formatHashtags } from "../models/video";
const userObj= {
    username:"yebeen",
    loggedIn:false,
};
export const home = async(req,res) =>{
    const videos = await Video.find();
    return res.render("home",{pageTitle:"Home",userObj:userObj,videos});
}
export const getEdit =async(req,res)=>{
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.render("404",{pageTitle:"video not found", userObj});

    }
    return res.render("edit",{pageTitle:`Edit ${video.title}`,userObj:userObj,video});
}
export const postEdit = async(req,res)=>{
    const {id} = req.params;
    const {title,description,hashtags} = req.body;
    console.log("adkenas");
    // const video =await Video.exists({_id:id});
    if(!(await Video.exists({_id:id}))){
        return res.render("404",{pageTitle:"video not found", userObj});
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
        return res.render("404",{pageTitle:"video not found", userObj});
    }
    return res.render("watch",{pageTitle:video.title ,userObj:userObj,video});
};
export const search=(req,res)=>{
    return res.send("search",{pageTitle:"Search",userObj:userObj,videos});
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
        res.render("upload",{pageTitle:"Upload Video",userObj,errorMessage:error._message});
    }
}
export const deleteVideo=(req,res)=>{
    return res.send("delete video",{pageTitle:"DeleteVideo",userObj:userObj,videos});
}