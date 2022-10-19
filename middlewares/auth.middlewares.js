
const isLoggedIn = (req,res,next) =>{
    if(req.session.userConnected === undefined){
        res.redirect ("auth/login")
    }else{
        
        next()
    }
}


module.exports = {

    isLoggedIn
}