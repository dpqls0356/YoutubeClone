import User from "../models/userModel.js";
import fetch from "node-fetch";
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
        // console.log(userData,userEmail);
        const emailObj = userEmail.find((email)=>email.primary===true&&email.verified===true);
        if(!(emailObj)){
            return res.redirect("/");
        }
        else{
            const existsUser = await User.findOne({email:emailObj.email});
            if(existsUser){
                if(existsUser.socialOnly===true){
                    // 로그인 시키기
                    req.session.user = existsUser;
                    req.session.loggedIn=true;
                    return res.redirect("/");
                }
                else{
                    // 이미 계정이 있는 이메일이기때문에 다시 로그인 창으로 이동
                    return res.render("/login",{emailErrorMessage:true})
                }
            }
            else{
                const idList = await User.find({},'userid');
                const randomId = generateRandomString(14,idList);
                console.log(randomId);
                const user = await User.create({
                    avatarUrl:userData.avatar_url,
                    socialOnly:true,
                    email:emailObj.email,
                    username:userData.name,
                    // 자동으로 아이디와 패스워드를 생성시켜주는 걸 찾아보자
                    userid:randomId,
                    password:userData.node_id,
                });
                req.session.loggedIn=true;
                req.session.user =user;
                return res.redirect("/");
            }
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