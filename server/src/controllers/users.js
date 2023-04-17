const dev = require("../config");
const {securePassword,comparePassword} = require("../helper/bcryptPassword");
const { sendEmailWithNodeMailer } = require("../helper/email");
const User = require("../model/users");
var jwt = require('jsonwebtoken');
var fs = require('fs');
const nodemailer = require("nodemailer");


const registerUser=async(req,res)=>{
    try {
        const{name,email,password,phone}=req.fields;
        const {image}=req.files;
        if(!name || !email || !password || !phone){
            res.status(404).json({message:"filed is missing"})
        }

        if(password.length < 6){
            res.status(404).json({message:"minimum length password is 6"})
        }
        // if(image && image.size < 1000000){
        //     res.status(400).json({message:"max size  is 1 MB"})
        // }
 
        const isExist=await  User.findOne({email:email})
        if(isExist){
            return res.status(400).json({message:"user with this email already exist"})
        }

        const hashedPassword = await securePassword(password);
        var token = jwt.sign({ name,email,hashedPassword ,phone,image },
            dev.app.jwtSecretKey,
            {expiresIn:"10m"});
        
        const emailData = ()=>{
            email;
            subject:"Account activation Email";
            html:`
            <h2>Hello ${name}!</h2>;
            <p>please click here to 
                <a href="${dev.app.clientUrl}/app/users/activate/${token}"
                terget="_blank">active your account</a></p>
                `
        }
        sendEmailWithNodeMailer(emailData);

        res.status(200).json({
            message:"varification email send to your email",
            token:token,
        });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const varifyEmail=async(req,res)=>{

    try {
        const {token}=req.body;
        if(!token){
            return res.status(404).json({message:"token is missing"})
        }

        jwt.verify(token, dev.app.jwtSecretKey, async function(err, decoded) {
            if(err){
                return res.status(401).json({message:"token is expired"})
            }
             const {name,email,password,phone,image}=decoded;
             const isExist=await  User.findOne({email:email})
             if(isExist){
                 return res.status(400).json({message:"user with this email already exist"})
             }
             const newUser =  new User({
                name:name,
                email:email,
                password:password,
                phone:phone,
                is_varified:1,
             })
             if(image){
                newUser.image.data=fs.readFileSync(image.path);
                newUser.image.contentType=image.type;
             }
             const user= await newUser.save()
             if(!user){
                res.status(400).json({message:"user was not repeted"})
             }
          });
        res.status(200).json({
            user,
            message:"user was created you can signIn"})
    } catch (error) {
        res.status(500).json({message:console.error.message})
    }

}

const loginUser=async (req,res)=>{
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

        isPassworMatched=comparePassword(password,user.password);
        if(!isPassworMatched){
            return res.status(400).json({message:"email/password dose not match"})
        }

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

const logoutUser=async (req,res)=>{
    try {
        res.status(200).json({message:"logout successfull"})
    } catch (error) {
        res.status(500).json({message:console.error.message})
        
    }
}

const userProfile=async (req,res)=>{
    try {
        res.status(200).json({message:"profile is returned"})
    } catch (error) {
        res.status(500).json({message:console.error.message})
        
    }
}




module.exports={registerUser,varifyEmail,loginUser,logoutUser,userProfile }