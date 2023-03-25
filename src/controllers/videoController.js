export const trending = (req,res) =>{
    return res.send("show trending video at homepage");
}
export const edit =(req,res)=>{
    return res.send("Edit Video")
}
export const see=(req,res)=>{
    console.log(req.params);
    return res.send("watch video")
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