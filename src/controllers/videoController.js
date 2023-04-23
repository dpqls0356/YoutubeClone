import Video from "../models/video";
const userObj= {
    username:"yebeen",
    loggedIn:false,
};
export const home = async(req,res) =>{
    try{
    const videos = await Video.find({});
    return res.render("home",{pageTitle:"Home",userObj:userObj,videos});
} catch(error){
    return res.send("ERROR");
}
}
export const getEdit =(req,res)=>{
    const {id} = req.params;
    return res.render("edit",{pageTitle:`Edit `,userObj:userObj});
}
export const postEdit = (req,res)=>{
    const {id} = req.params;
    return res.redirect(`/videos/${id}`);
}
export const watch=(req,res)=>{
    const {id} = req.params;
    // const id = req.params
    const video = videos[id-1];
    return res.render("watch",{pageTitle:`Watching `+video.title ,userObj:userObj,video});
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
            desrciption: description,
            createdAt: Date.now(),
            hashtags:hashtags.split(",").map(word=>`#${word}`),
            meta:{
            views:0,
            rating:0,
            }
        })
        res.redirect("/");
    }
    catch(error){
        res.end();
    }
}
export const deleteVideo=(req,res)=>{
    return res.send("delete video",{pageTitle:"DeleteVideo",userObj:userObj,videos});
}