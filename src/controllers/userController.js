import { userObj } from "./videoController";
export const getJoin = (req,res) => {
    return res.render("join",{pageTitle:"join",userObj});
}
export const postJoin = (req,res)=>{
    return res.end();
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