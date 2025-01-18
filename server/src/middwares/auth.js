const isLoggedIn=(req,res,next)=>{
    try {
        
        if(req.session.userId){
           
            next()
        }
        else{
            return res.status(400).json({message:"please login"})
        }
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }

}

const isLoggedOut=(req,res,next)=>{
    try {
        
        if(req.session.userid){
          
            return res.status(400).json({message:"please logout"})
        }
            next()
    } catch (error) {
        res.status(404).json({message:error.message});
        
    }

}


module.exports={isLoggedIn,isLoggedOut}

