import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
    socialOnly : {type:Boolean,default:false},
    email:{type:String,required:true,unique:true},
    username :{type:String,required:true,},
    userid:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    birth:{type:Date},
    avatarUrl:{type:String},
    video:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}],
    comment:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}],

});
userSchema.pre('save',async function(){

    this.password = await bcrypt.hash(this.password,5);
});
console.log(mongoose.models.User);
const User = mongoose.model("User",userSchema);

export default User;