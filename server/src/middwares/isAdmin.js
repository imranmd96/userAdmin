const User = require("../model/users");

const isAdmin=async (req,res,next)=>{
    try {
        if(req.session.userId){
            const id = req.session.userId
            const adminData= await User.findById();
            if(adminData.is_admin===1){
                next()
            }
        }
        else{
            return res.status(400).json({message:"please login"})
        }
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

module.exports=isAdmin;