export const trending = (req,res) =>{
    return res.render("home",{pageTitle:"Home"});}
export const edit =(req,res)=>{
    return res.send("Edit Video")
}
export const watch=(req,res)=>{
    return res.render("watch",{pageTitle:"Watch"});
};
export const search=(req,res)=>{
    return res.send("search");
}
export const upload=(req,res)=>{
    return res.send("upload video");
}
export const deleteVideo=(req,res)=>{
    return res.send("delete video");
}