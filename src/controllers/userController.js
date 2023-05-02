import User from "../models/user";
import bcrypt from "bcrypt";
export const userObj= {
    loggedIn:false,
    username : "",
};
export const getJoin = (req,res) => {
    return res.render("join",{pageTitle:"Join",userObj});
}
export const postJoin = async(req,res)=>{
    const {name,username,email,password,confirmPassword,location} = req.body;
    const userExists = await User.find({$or : [{username},{email}]});
    if(userExists){
        return res.status(400).render("join",{pageTitle:"Join",userObj,errorMessage:"This username/email is already taken..."});
    }
    if(confirmPassword!==password){
        return res.render("join",{pageTitle:"Join",userObj,errorMessage:"Password confirmation does not match..."});
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
    res.send("Edit User");
    return res.send("Edit User");
}
export const deleteUser = (req,res) =>{
    res.send("Delete User");
    return res.send("Delete User");
}
export const getLogin = (req,res)=>{
    return res.render("login",{pageTitle:"Login",userObj});
}
export const postLogin = async(req,res)=>{
    const {username,password}  = req.body;
    //계정 단 한개만 찾아야기에 findOne -> find로 하면 배열로 나와서 51라인 오류 뜸
    const user = await User.findOne({username});
    const users = await User.find({username});
    console.log(user);
    console.log(users);
    if(!user){
        return res.status(400).render("login",{
            pageTitle:"Login",
            errorMessage:"An account with this username does not exists.",
            userObj
        });
    }
    else if(!(await bcrypt.compare(password,user.password))){
        return res.status(400).render("login",{
            pageTitle:"Login",
            errorMessage:"Wrong password",
            userObj
        });
    }
    else{
        userObj.loggedIn="true";
        userObj.username = username;
        return res.redirect("/",{pageTitle:"home",userObj});
    }
}
export const logout = (req,res)=>{
    return res.send("logout");
}
export const see=(req,res)=>{
    return res.send("see");
}