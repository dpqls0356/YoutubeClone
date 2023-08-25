import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    hashtag:[{type:String}],
    createAt:{type:Date,default:Date.now,required:true},
    videoUrl:{type:String,required:true},
    thumbUrl:{type:String,required:true},
    meta:{
        views:{type:Number, default:0,},
        likes:{type:Number,default:0,}
    },
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    comment:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],    
})

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