import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    socialOnly : {type:Boolean,default:false},
    email:{type:String ,required:true,unique:true},
    username :{type:String, required:true,unique:true},
    password :{type:String,},
    name :{type:String, required:true,},
    location:String,
    avatarUrl:String,
    videos:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}],
    // videos는 objectId로 구성된 배열인데 Video model로 연결되어있다.
});

userSchema.pre('save',async function(){
    if(this.isModified("password"))
        this.password = await bcrypt.hash(this.password,5);
});
const User =  mongoose.model("User",userSchema);
export default User;
