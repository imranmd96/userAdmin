const {isLoggedIn,isLoggedOut}=require('../middwares/auth');
const formidable = require('express-formidable');
const adminRouter = require('express').Router();
const express= require('express');
const session = require('express-session');
const dev = require('../config');
const { logInAdmin,logOutAdmin, getAllUsers,deleteUserbyAdmin,updateAdmin} = require('../controllers/adminController');
const { registerUser } = require('../controllers/users');
const isAdmin = require('../middwares/isAdmin');

adminRouter.use(session({
    name: 'admin_session',
    secret: dev.app.sessionSecretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,maxAge:20*6000, }
  }))
  adminRouter.post("/login",isLoggedOut,logInAdmin)
  adminRouter.get("/logout",isLoggedIn,logOutAdmin)
  adminRouter.post("/register",registerUser)

  adminRouter.get("/dashboard",isLoggedIn,getAllUsers)
  // adminRouter.post("/dashboard",isLoggedIn,creatUser)
  // adminRouter.put("/dashboard",isLoggedIn,isAdmin,updateAdmin)
  // adminRouter.delete("/dashboard/:id",isLoggedIn,isAdmin,deleteUserbyAdmin)

module.exports=adminRouter;
 