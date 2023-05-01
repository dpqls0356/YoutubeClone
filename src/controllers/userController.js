import User from "../models/User";
import { userObj } from "./videoController";
export const getJoin = (req,res) => {
    return res.render("join",{pageTitle:"join",userObj});
}
export const postJoin = async(req,res)=>{
    const {name,username,email,password,location} = req.body;
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
export const login = (req,res)=>{
    return res.send("login page");
}
export const logout = (req,res)=>{
    return res.send("logout");
}
export const see=(req,res)=>{
    return res.send("see");
}