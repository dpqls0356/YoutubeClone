import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    id:{type:String,unique:true},
    text:{type:String},
    createAt:{type:Date.now()},
    owner : {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    video:{type:mongoose.Schema.Types.ObjectId,ref:"Video"},
});