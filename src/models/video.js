import mongoose from "mongoose";

// export const formatHashtags=(hashtags)=>{
//    return hashtags.split(",").map((word)=>word.startsWith('#')? word : `#${word}`);
// }
const videoSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
    title: {type:String, required:true},
    fileUrl:{type:String,required:true},
    thumbUrl:{type:String,required:true},
    description: {type:String, required:true},
    createdAt: {type:Date,required:true,default:Date.now},
    hashtags:[{type:String}],
    meta:{
        views:{type:Number, default:0,required:true},
        rating:{type:Number, default:0,required:true},
    },
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],
});
// 방법1
// videoSchema.pre('save', async function(){
//     this.hashtags = this.hashtags[0].split(",").map(word=>word.startsWith('#')? word : `#${word}`)
// })
// 방법2
videoSchema.static('formatHashtags',function(hashtags){
    return hashtags.split(",").map((word)=>word.startsWith('#')? word : `#${word}`); 
})
const Video = mongoose.model("Video",videoSchema);
export default Video;