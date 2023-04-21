const userObj= {
    username:"yebeen",
    loggedIn:true,
};
const videos=[
    {
        title : "video1",
        rating : 3,
        comments:2,
        createdAt: "2 minutes ago",
        views:1,
        id:1,
    },
    {
        title : "video2",
        rating : 4,
        comments:10,
        createdAt: "10 minutes ago",
        views:33,
        id:2,
    },
    {
        title : "video3",
        rating : 3,
        comments:16,
        createdAt: "16 minutes ago",
        views:51,
        id:3,
    }
];
export const trending = (req,res) =>{
    return res.render("home",{pageTitle:"Home",userObj:userObj,videos});
}
export const getEdit =(req,res)=>{
    const {id} = req.params;
    const video = videos[id-1];
    return res.render("edit",{pageTitle:`Edit `+video.title,userObj:userObj,video});
}
export const postEdit = (req,res)=>{
    const {id} = req.params;
    videos[id-1].title = req.body.title;
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
export const upload=(req,res)=>{
    return res.send("upload video",{pageTitle:"Upload",userObj:userObj,videos});
}
export const deleteVideo=(req,res)=>{
    return res.send("delete video",{pageTitle:"DeleteVideo",userObj:userObj,videos});
}