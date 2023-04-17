const { registerUser, varifyEmail, loginUser, logoutUser, userProfile } = require('../controllers/users');
const formidableMiddleware = require('express-formidable');

const router=require('express').Router();

router.post("/register",formidableMiddleware(),registerUser)
router.post("/varify-email",varifyEmail)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get("/profile",userProfile)




module.exports=router;
