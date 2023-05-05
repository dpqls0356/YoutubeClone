import User from "../models/user";
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
export const edit = (req,res) =>{
    return res.send("Edit User");
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
    const user = await User.findOne({username});
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
    req.session.loggedIn=false;
    return res.redirect('/');
}
export const see=(req,res)=>{
    return res.send("see");
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
        const userData = await (
          await fetch(`${apiUrl}/user`, {
            headers: {
              Authorization: `token ${access_token}`,
            },
          })
        ).json();
        const userEmail = await(
            await fetch(`${apiUrl}/user/emails`,{
                headers:{
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();
        console.log(userEmail);
        res.send(userEmail);
    }
    else{
        return res.redirect("/login");
    }
}