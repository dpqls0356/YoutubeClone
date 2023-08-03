import User from "../models/userModel.js";
export const getJoin = (req,res) =>{
    return res.render("user/join");
}
export const getLogin = (req,res)=>{
    return res.render("user/login");
}
export const postJoin = async(req,res)=>{
    const {username,id,password,checkingpassword,email,birth} =req.body;
    // 아이디가 겹치는지
    const userExistById = await User.findOne({userid:id});
    if(userExistById){
        console.log(userExistById);
        return res.render("user/join",{pageTitle:"Join",idErrorMessage:"중복된 아이디입니다..."});
    }
    // 이메일이 겹치는 지 --- 소셜로 가입하는 경우 때문에
    const userExistsByEmail = await User.findOne({email:email});
    if(userExistsByEmail){
        console.log(userExistsByEmail)
        return res.render("user/join",{pageTitle:"Join",emailErrorMessage:"이미 사용중인 이메일입니다..."});
    }
    // 비번이 일치하는지
    if(password!==checkingpassword){
        return res.render("user/join",{pageTitle:"Join",pwErrorMessage:"비밀번호가 일치하지않습니다."});
    }
    await User.create({
        username,userid:id,password,email,birth
    });
    return res.redirect("user/login");
    
}