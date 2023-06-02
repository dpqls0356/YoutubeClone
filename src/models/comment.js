import mongoose from "mongoose";

const commentShema = new mongoose.Schema({
    text:{type:String,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId,required:true,reef:"User"},
    video:{
        type:mongoose.Schema.Types.ObjectId,required:true,ref:"Video"
    },
    createdAt: {type:Date,required:true,default:Date.now},
})

const Comment=mongoose.model("Comment",commentShema);
export default Comment;