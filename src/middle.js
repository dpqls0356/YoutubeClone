export const localsMiddleware = (req,res,next)=>{
    console.log("===================================================");
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.user = req.session.user;
    // console.log(res.locals);
    next();
}