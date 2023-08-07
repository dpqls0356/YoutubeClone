import User from "../models/userModel.js";
import bcrypt from "bcrypt";
export const getJoin = (req,res) =>{
    return res.render("user/join");
}
export const postJoin = async(req,res)=>{
    const {username,id,password,checkingpassword,email,birth} =req.body;
    // 아이디가 겹치는지
    // 아이디 또는 아이디가 겹치는지 알고싶으면 => exists({$of:[{username},{email}]})
    const userExistById = await User.exists({userid:id});
    const pageTitle = "Join";
    if(userExistById){
        return res.status(400).render("user/join",{pageTitle,idErrorMessage:"중복된 아이디입니다..."});
    }
    // 이메일이 겹치는 지 --- 소셜로 가입하는 경우 때문에
    const userExistsByEmail = await User.findOne({email:email});
    if(userExistsByEmail){
        console.log(userExistsByEmail)
        return res.status(400).render("user/join",{pageTitle,emailErrorMessage:"이미 사용중인 이메일입니다..."});
    }
    // 비번이 일치하는지
    if(password!==checkingpassword){
        return res.status(400).render("user/join",{pageTitle,pwErrorMessage:"비밀번호가 일치하지않습니다."});
    }
    await User.create({
        username,userid:id,password,email,birth
    });
    return res.redirect("user/login");
    
}
export const getLogin = (req,res)=>{
    return res.render("user/login");
}
export const postLogin = async(req,res)=>{
    const {id,password} = req.body;
    const userExist = await User.findOne({userid:id});
    if(!userExist){
        return res.status(404).render("user/login",{pageTitle:"Login",idErrorMessage:"존재하지않는 아이디입니다."});
    }

    if(!(await bcrypt.compare(password,userExist.password))){
        return res.render("user/login",{pageTitle:"Login",pwErrorMessage:"잘못된 비밀번호입니다."});
    }
    else{
        req.session.loggedIn = true;
        req.session.user = userExist;
        return res.redirect("/");
        

    }
}