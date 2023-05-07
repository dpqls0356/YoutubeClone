export const localsMiddleware = (req,res,next)=>{
    console.log("===================================================");
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.user = req.session.user;
    // console.log(res.locals);
    next();
}
// 로그인
export const protectorMiddleware = (req,res,next) =>{
    if(req.session.loggedIn){
        return next();   
    }    
    else{
        return res.redirect("/login");
    }
}
// 비로그인
export const publicOnlyMiddleware = (req,res,next)=>{
    if(req.session.loggedIn){
        return res.redirect("/");
    }
    else{
        return next();
    }
}