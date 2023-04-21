import Video from "../models/video";
const userObj= {
    username:"yebeen",
    loggedIn:true,
};
export const home = (req,res) =>{
    Video.find({},(error,vidoes)=>{

    });
    console.log("Hello");
    return res.render("home",{pageTitle:"Home",userObj:userObj,});
    // hello출력 후 render가 되기에 logger가 나오고 그 이후에 find가 실행 - callback은 마지막에 함수를 호출
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
export const postUpload=(req,res)=>{
    const {title} = req.body;
    res.redirect("/");
}
export const deleteVideo=(req,res)=>{
    return res.send("delete video",{pageTitle:"DeleteVideo",userObj:userObj,videos});
}