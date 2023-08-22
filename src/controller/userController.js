import User from "../models/userModel.js";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { config } from "dotenv";
export const getJoin = (req,res) =>{
    return res.render("user/join");
}
export const postJoin = async(req,res)=>{
    const {username,id,password,checkingpassword,email,birth} =req.body;
    // 아이디가 겹치는지
    // 아이디 또는 아이디가 겹치는지 알고싶으면 => exists({$of:[{username},{email}]})
    const userExistById = await User.exists({userid:id,socialOnly:false});
    const pageTitle = "Join";
    if(userExistById){
        return res.status(400).render("user/join",{pageTitle,idErrorMessage:"중복된 아이디입니다..."});
    }
    // 이메일이 겹치는 지 --- 소셜로 가입하는 경우 때문에
    const userExistsByEmail = await User.findOne({email:email});
    if(userExistsByEmail){
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
    const userExist = await User.findOne({userid:id,socialOnly:false});
    if(!userExist){
        return res.status(404).render("user/login",{pageTitle:"Login",idErrorMessage:"존재하지않는 아이디입니다."});
    }

    if(!(await bcrypt.compare(password,userExist.password))){
        return res.render("user/login",{pageTitle:"Login",pwErrorMessage:"잘못된 비밀번호입니다."});
    }
    else{
        //세션 초기화시킴
        req.session.loggedIn = true;
        req.session.user = userExist;
        return res.redirect("/");
        

    }
}
export const startGithubLogin = async(req,res)=>{
    const config = {
        client_id:process.env.GH_CLIENT_ID,
        allow_signup: false,
        scope: `user:email read:user`,
    }
    const params = new URLSearchParams(config).toString();
    const baseUrl = `https://github.com/login/oauth/authorize?${params}`;
    return res.redirect(baseUrl);

}
export const finishGithubLogin = async(req,res)=>{
    const config = {
        client_id : process.env.GH_CLIENT_ID,
        client_secret:process.env.GH_CLIENT_SECRET,
        code:req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const baseUrl = `https://github.com/login/oauth/access_token?${params}`;
    
    // 접근토큰얻는법
    // const data = await fetch(baseUrl,{
    //     method:"POST",
    //     headers:{
    //         // json으로 응답 받기위함 -> 없으면 text로 돌아옴
    //         Accept:"application/json"
    //     }
    // })
    // const json = await data.json();

    //위의 접근토큰 얻는 과정을 한번에 하는 방법
    const json = await (
        await fetch(baseUrl,{
            method:"POST",
            headers:{
                Accept:"application/json",
            }
        })
    ).json();
    // 토큰 유무에 따라 데이터 받아오기
    if("access_token" in json){
        const {access_token} = json;
        const apiUrl = "https://api.github.com";
        const userData = await(await fetch(`${apiUrl}/user`,{
            headers:{
                authorization:`token ${access_token}`
                }
        })).json();
        const userEmail = await(await fetch(`${apiUrl}/user/emails`,{
            headers:{
                authorization:`token ${access_token}`
                }
        })).json();
        console.log(userData,userEmail);
        const emailObj = userEmail.find((email)=>email.primary===true&&email.verified===true);
        if(!(emailObj)){
            return res.render("user/login",{emailErrorMessage:"해당 계정은 이메일 정보가 없습니다."});
        }
        else{
            const user = await User.findOne({email:emailObj.email});
            if(!user){
                const idList = await User.find({},'userid');
                const randomId = generateRandomString(14,idList);
                console.log(randomId);
                user = await User.create({
                    avatarUrl:userData.avatar_url,
                    socialOnly:true,
                    email:emailObj.email,
                    username:userData.name,
                    // 자동으로 아이디와 패스워드를 생성시켜주는 걸 찾아보자
                    userid:randomId,
                    password:userData.node_id,
                });
            }
            else if((user.socialOnly===false)||(String(user.userid)!==String(userData.id))){
                return res.render("user/login",{emailErrorMessage:"동일한 이메일을 사용하는 계정이 이미 존재합니다."})
            }
            req.session.loggedIn=true;
            req.session.user =user;
            return res.redirect("/");
        }
        
    }
    else{
        return res.redirect("/");
    }
    
}
export const getLogout = (req,res)=>{
    req.session.destroy();
    return res.redirect("/");
}
function generateRandomString(length,idList) {
    const characters = '1234567890';
    console.log(idList);
    while(true){
        let randomString = 'a';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
        // 문제는 얘네가 겹치는 아이디인지 아닌지 모름 
        // ---> 디비에서 id값을 전부 가져와서 비교해 ? 너무 시간 낭비인데 흠
        if(idList.includes(randomString)){
            continue;
        }
        else{
            return randomString;
        }

    }
}
export const startKakaoLogin = async(req,res)=>{
    const config = {
        response_type:"code",
        client_id:process.env.KAKAO_CLIENT_ID,
        redirect_uri:process.env.KAKAO_REDIRECT_URL,
    }
    const params =new URLSearchParams(config).toString();
    const baseUrl = `https://kauth.kakao.com/oauth/authorize?${params}`;
    return res.redirect(baseUrl);
}
export const finishKakaoLogin = async(req,res)=>{
    const config = {
        grant_type:"authorization_code",
        code: req.query.code,
        client_id:process.env.KAKAO_CLIENT_ID,
        redirect_uri:process.env.KAKAO_REDIRECT_URL,
        client_secret:process.env.KAKAO_CLIENT_SECRET,
    }
    const params = new URLSearchParams(config).toString();
    const baseUrl = `https://kauth.kakao.com/oauth/token?${params}`;
    const json = await(
        await fetch(baseUrl,{
            method:"POST",
        })
    ).json();
    const {access_token} = json;
    // 이메일이랑 여러 데이터를 가져와야함 ...
    const data = await (
        await fetch(`https://kapi.kakao.com/v2/user/me`,{
            method:"POST",
            headers:{
                Authorization: `Bearer ${access_token}`,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            }
        })
    ).json();
    // 계정넣기
    if(data.kakao_account.email){
        const user = await User.findOne({email:data.kakao_account.email});
        if(!user){
            user = await User.create({
                socialOnly:true,
                userid: data.id,
                avatarUrl: data.properties.profile_image,
                email: data.kakao_account.email,
                username: data.properties.nickname,
                password: data.id
            });
        }
        else if((user.socialOnly===false)||(String(user.userid)!==String(data.id))){
            return res.render("user/login",{emailErrorMessage:"동일한 이메일을 사용하는 계정이 이미 존재합니다."})
        }
        req.session.user = user;
        req.session.loggedIn = true;
        return res.redirect("/");
    }
    else{
        return res.render("user/login",{emailErrorMessage:"해당 계정은 이메일 정보가 없습니다."});
    }
}
// 이메일0 + not social = 계정이 있는 이메일 완료
// 이메일0 + social = 로그인 시키기 -> 연동을 무엇으로 시켰는지에 따라 달라짐 아이디값을 비교하면 되겟네
// 이메일 x  = 새로 추가시키기 = 완료

// 기존 : 메일의 유무만을 판단해서 일치하는 메일이 있으면 로그인이 가능하도록 함 -> 이 경우에 카카오를 이용해 가입했다가 이메일이 일치하는 다른 sns으로 로그인해도 로그인이 가능해져버림

// 해결 -> sns측에서 아이디값을 주거나 랜덤으로 부여했던 아이디값이 일치해야만 로그인할 수 있도록 함 -> 엇 깃헙은 내가 랜덤값으로 줘버려서 id값 일치를 확인할 수 없음