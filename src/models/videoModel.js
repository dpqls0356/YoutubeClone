import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
    id:{type:String,unique:true,required:true},
    title:{type:String,required:true},
    description:{type:String},
    hashtag:[{type:String}],
    createAt:{type:Date,default:Date.now,required:true},
    fileUrl:{type:String,required:true},
    thumbUrl:{type:String,required:true},
    meta:{
        views:{type:Number, default:0,required:true},
        likes:{type:Number,default:0,}
    },
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    comment:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],    
})

const Video = mongoose.model("Video",videoSchema);
export default Video;