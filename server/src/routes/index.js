const { registerUser, varifyEmail, loginUser, logoutUser, userProfile ,deleteUser,updateUser,forgetPassword,resetPassword} = require('../controllers/users');
const {isLoggedIn,isLoggedOut}=require('../middwares/auth');
const formidable = require('express-formidable');
const router=require('express').Router();
const express= require('express');
const session = require('express-session');
const dev = require('../config');

router.use(session({
    name: 'user_session',
    secret: dev.app.sessionSecretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,maxAge:20*6000, }
  }))

router.post("/register",registerUser)
router.post("/varify-email",varifyEmail)
router.post("/login",isLoggedOut,loginUser)
router.get("/logout",isLoggedIn,logoutUser)
router.route("/")
.get(isLoggedIn,userProfile)
.delete(isLoggedIn,deleteUser)
.put(isLoggedIn,updateUser)
router.put("/forget-password",isLoggedOut,forgetPassword)
router.put("/reset-password",isLoggedOut,resetPassword)

module.exports=router;
