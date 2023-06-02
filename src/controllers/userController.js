import User from "../models/user";
import Video from "../models/video"
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req,res) => {
    return res.render("join",{pageTitle:"Join",});
}
export const postJoin = async(req,res)=>{
    const {name,username,email,password,confirmPassword,location} = req.body;
    const userExists = await User.findOne({$or : [{username},{email}]});
    if(userExists){
        return res.status(400).render("join",{pageTitle:"Join",errorMessage:"This username/email is already taken..."});
    }
    if(confirmPassword!==password){
        return res.render("join",{pageTitle:"Join",errorMessage:"Password confirmation does not match..."});
    }
    await User.create({
        name,
        username,
        email,
        password,
        location
    });
    return res.redirect("/login");
}
export const deleteUser = (req,res) =>{

    return res.send("Delete User");
}
export const getLogin = (req,res)=>{
    return res.render("login",{pageTitle:"Login",});
}
export const postLogin = async(req,res)=>{
    const {username,password}  = req.body;
    //계정 단 한개만 찾아야기에 findOne -> find로 하면 배열로 나와서 51라인 오류 뜸
    const user = await User.findOne({username,socialOnly:false});
    if(!user){
        return res.status(400).render("login",{
            pageTitle:"Login",
            errorMessage:"An account with this username does not exists.",
                    });
    }
    else if(!(await bcrypt.compare(password,user.password))){
        return res.status(400).render("login",{
            pageTitle:"Login",
            errorMessage:"Wrong password",
                    });
    }
    else{
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }
}
export const logout = (req,res)=>{
    req.session.destroy();
    return res.redirect('/');
}

export const startGithubLogin = (req,res)=>{
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : "read:user user:email",

    }
    const params = new URLSearchParams(config).toString();
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const finalUrl = `${baseUrl}?${params}`;
    res.redirect(finalUrl);

}
export const finishGithubLogin = async(req,res)=>{
    // github에서 받은 토큰을 접근 토큰으로 변경
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config={
        client_id : process.env.GH_CLIENT,
        client_secret : process.env.GH_SECRET,
        code : req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    // url를 post하여 데이터를 받음
    const tokenRequest = await (
        await fetch(finalUrl,{
            method :"POST",
            headers:{
                Accept:"application/json"
            }
    })).json();
    // 받은 데이터 json화
    // const json = await data.json();
    if("access_token" in tokenRequest){
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        // 유저데이터 불러오기
        const userData = await (
          await fetch(`${apiUrl}/user`, {
            headers: {
              Authorization: `token ${access_token}`,
            },
          })
        ).json();
        // 이메일데이터 불러오기
        const emailData = await(
            await fetch(`${apiUrl}/user/emails`,{
                headers:{
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();
        // 이메일 데이터중 primary, verified true인 값 가져오기
        const emailObj = emailData.find((email)=>email.primary==true&&email.verified==true);
        // 깃헙 email이 없는 경우
        if(!emailObj){
            return res.redirect("/login");
        }

        var user = await User.findOne({email:emailObj.email});
        //  깃헙 계정은 있지만 현재사이트의 계정이 없는 경우
        if(!user){
            user = await User.create({
                avatarUrl:userData.avatar_url,
                name : userData.name,
                username:userData.login,
                email:emailObj.email,
                socialOnly:true,
                password:"",
                location:userData.location,
            });
        }
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");

    }
    else{
        return res.redirect("/login");
    }
}
export const getEdit = (req,res) =>{
    return res.render("users/profile-edit",{pageTitle:"Edit"});
}
export const postEdit = async(req,res)=>{
    // const id = req.session.user._id;
    // const {name,email,location} = req.body;
    // 한번에 쓰기
    const {
        session:{
            user:{_id,avatarUrl},
        },
        body:{name,email,location},
        file
    } = req;
   const emailExists = await User.findOne({_id:{$ne:_id},email:email});
   const nameExists = await User.findOne({_id:{$ne:_id},name:name});
   if(emailExists){
    return res.render("users/profile-edit",{error:"This email is already taken..."});
   }
   else if(nameExists){
    return res.render("users/profile-edit",{error:"This name is already taken..."});
   }
   const updatedUser = await User.findByIdAndUpdate({_id:_id},{
        avatarUrl:file?file.path:avatarUrl,
        name:name,
        email:email,
        location:location,
    },{new:true});
    // 세션 업데이트1
    // req.session.user={
    //     ...req.session.user,
    //     name,
    //     email,
    //     location
    // }
    // 세션 업데이트2
    req.session.user=updatedUser;
    return res.redirect("/");
}

export const getChangePw = (req,res)=>{
    // 깃헙 계정이면 비번 변경 페이지에 접근이 안되게 함
    if(req.session.user.socialOnly){
        req.flash("error","Cant change password");
        return res.redirect("/");
    }
    return res.render("users/changePassword",{pageTitle:"Edit - Password"});

}
export const postChangePw = async(req,res)=>{
    const {
        session:{
            user:{_id}
        },
        body:{
            oldpw,newpw,confirmpw
        }
    } = req;
    if(!(confirmpw===newpw)){
        return res.status(400).render("users/changePassword",{pageTitle:"Edit - Password",error:"New Password not match..."});
    }
    else if(!(await bcrypt.compare(oldpw,req.session.user.password))){
        return res.status(400).render("users/changePassword",{pageTitle:"Edit - Password",error:"Current Password not match..."});
    }
    await User.findOneAndUpdate({_id:_id},{password:await bcrypt.hash(newpw,5)});
    req.session.user = await User.findById(_id);
    req.fetch("info","Success Change Your Password");
    return res.redirect('/');
}
export const getProfile = async(req,res)=>{
    const {id} = req.params;
    // const user = await User.findById(id).populate("videos");
    const user = await User.findById(id).populate({
        path:"videos",
        populate:{
            path:"owner",
            model:"User",
        }
    });
    // console.log(user);
    // const videos = await Video.find({owner:id});
    if(!user){

        return res.status(404).render("404",{pageTitle:"User not found"});
    }
    // return res.render("users/profile",{pageTitle:`${user.name}의 Profile`,user,videos});
    return res.render("users/profile",{pageTitle:`${user.name}의 Profile`,user});

}