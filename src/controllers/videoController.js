export const trending = (req,res) =>{
    return res.render("home");}
export const edit =(req,res)=>{
    return res.send("Edit Video")
}
export const watch=(req,res)=>{
    return res.render("watch");
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