import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    socialOnly : {type:Boolean,default:false},
    email:{type:String,required:true,unique:true},
    id:{type:String,required:true,unique:true},
    username :{type:String,required:true,},
    userid:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    birth:{type:Date},
    avatarUrl:{type:String},
    video:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}],
    comment:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}],

});
const User = mongoose.model("User",userSchema);
export default User;