const dev = require("../config");
const {securePassword,comparePassword} = require("../helper/bcryptPassword");
const  sendEmailWithNodeMailer  = require("../helper/email");
const User = require("../model/users");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser')

const logInAdmin=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if( !email || !password ){
            res.status(404).json({message:"filed is missing"})
        }
        if(password.length < 6){
            res.status(404).json({message:"minimum length password is 6"})
        }

        const user=await  User.findOne({email:email})
        if(!user){
            return res.status(400).json({message:"user not exit please signUp"})
        }
        if(user.is_admin===0){
            return res.status(400).json({message:"User is not admin"})

        }
        isPassworMatched=comparePassword(password,user.password);
        if(!isPassworMatched){
            return res.status(400).json({message:"email/password dose not match"})
        }
        //creating session here//
        req.session.userId=user._id

        res.status(200).json({
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                image:user.image,
            },
            message:"logIn successfull"})
    } catch (error) {
        res.status(500).json({message:console.error.message})
        
    }
}

const getAllUsers=async (req,res)=>{
    try {
        const users = await User.findOne({is_admin:0})
        res.status(200).json({
            ok:true,
            message:"returned all users successfull",
            users:users,})
          
    } catch (error) {
        res.status(500).json({
            ok:false,
            message:console.error.message})
        
    }
}

const logOutAdmin=async (req,res)=>{
    try {
        req.session.destroy();
        res.clearCookie("admin")
        res.status(200).json({
            ok:true,
            message:"logout successfull"})
    } catch (error) {
        res.status(500).json({
            ok:false,
            message:console.error.message})
        
    }
}

const deleteUserbyAdmin=async (req,res)=>{
    try {
        const {id}=req.params;
        const user=await  User.findById(id);
        if(!user){
            return res.status(400).json({message:"user not exit please signUp"})
        }
        await User.findByIdAndDelete(id)
        return res.status(200).json({
            ok:true,
            message:"delete user successfull",
            users:user,})
        
    } catch (error) {
        res.status(404).json({message:error.message})
    }

}


module.exports={logInAdmin,logOutAdmin,getAllUsers,deleteUserbyAdmin}
