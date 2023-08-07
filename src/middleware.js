export const localsMiddleware=(req,res,next)=>{
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    if (res.locals.loggedIn){
        res.locals.user= req.session.user;
    }
    next();
}