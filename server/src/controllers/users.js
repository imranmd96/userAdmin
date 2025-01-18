const dev = require("../config");
const {securePassword,comparePassword} = require("../helper/bcryptPassword");
const { sendEmailWithNodeMailer } = require("../helper/email");
const User = require("../model/users");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser')




const registerUser=async(req,res)=>{
    try {
        const{name,email,password,phone}=req.body;
        console.log(req.body)
        // const {image}=req.files;
        if(!name || !email || !password || !phone){
            res.status(404).json({message:"filed is missing"})
        }

        // if(password.length < 6){
        //     res.status(404).json({message:"minimum length password is 6"})
        // }
        // if(image && image.size < 1000000){
        //     res.status(400).json({message:"max size  is 1 MB"})
        // }
 
        const isExist=await  User.findOne({email:email})
        if(isExist){
            return res.status(400).json({message:"user with this email already exist"})
        }

        const hashedPassword = await securePassword(password)
        const token = jwt.sign({ name,email,hashedPassword ,phone },
            dev.app.jwtSecretKey,
            {expiresIn:"100m"});

        const emailData = {
            email,
            subject:"Account activation Email",
            html:`
            <h2>Hello ${name}!</h2>;
            <p>please click here to 
                <a href="${dev.app.clientUrl}/app/users/activate?token=${token}"
                terget="_blank">active your account</a></p>
                `
        }
        sendEmailWithNodeMailer(emailData);

        res.status(200).json({
            message:"varification email send to your email",
            token:token,
        });
    } catch (error) {
        console.log(error)
        // res.status(500).json({message:error.message})
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
             const {name,email,hashedPassword,phone,image}=decoded;
             const isExist=await  User.findOne({email:email});
             if(isExist){
                 return res.status(400).json({message:"user with this email already exist"})
             }
             const newUser =  new User({
                name:name,
                email:email,
                password:hashedPassword,
                phone:phone,
                is_varified:1,
             })
             if(image){
                newUser.image.data=fs.readFileSync(image.path);
                newUser.image.contentType=image.type;
             }
             const user= await newUser.save()
             if(!user){
                res.status(400).json({message:"user was not created"})
             }
          });
        res.status(200).json({
            // user,
            message:"User created successfully you can signIn"})
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

        const isPassworMatched=comparePassword(password,user.password);
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
                
            },
            message:"logIn successfull"})
    } catch (error) {
        res.status(500).json({message:console.error.message})
        
    }
}

const logoutUser=async (req,res)=>{
    try {
        req.session.destroy();
        res.clearCookie("user_session")
        res.status(200).json({
            ok:true,
            message:"logout successfull"})
            
    } catch (error) {
        res.status(500).json({
            ok:false,
            message:console.error.message})
        
    }
}

const userProfile=async (req,res)=>{
    try {
        const userData= await User.findById(req.session.userId);
        console.log(req.session.userId)
        res.status(200).json({
            ok:true,
            message:"profile is returned",
            user:userData,
        })
    } catch (error) {
        res.status(500).json({message:console.error.message})
        
    }
}

const deleteUser=async (req,res)=>{
    try {
        await User.findByIdAndDelete(req.session.userId);
        res.status(200).json({
            ok:true,
            message:"user was deleted seccessfully",
        })
    } catch (error) {
        res.status(500).json({message:console.error.message})
        
    }
}

const updateUser=async (req,res)=>{
    try {
        if(!req.fields.password){
            res.status(400).json({message:" field is missing",})
        }
        const hashedPassword = await securePassword(password);
        const updateData=await User.findByIdAndUpdate(
            req.session.userId,
            { ...req.fields,password:hashedPassword,},
             { new:true, }
            );

            if(!updateData){
                res.status(400).json({
                    ok:false,
                    message:"user was not updated",
                })
            }
            if(req.files.image){
                const {image}=req.files;
                updateData.image.data=fs.readFileSync(image.path);
                updateData.image.contentType=image.type;
            }
            await updateData.save();

        res.status(200).json({
            ok:true,
            message:"user was deleted seccessfully",
        })
    } catch (error) {
        res.status(500).json({message:console.error.message})
        
    }
}

const forgetPassword=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if( !email || !password ){
            res.status(404).json({message:"email or password is missing"})
        }
        if(password.length < 6){
            res.status(404).json({message:"minimum length password is 6"})
        }
        const isExist=await  User.findOne({email:email});
        if (!isExist){
            res.status(400).json({message:"user not exit"})
        }
        const hashedPassword = await securePassword(password)
        const token = jwt.sign({ email,hashedPassword  },
            dev.app.jwtSecretKey,
            {expiresIn:"10m"});

        const emailData = {
            email,
            subject:"Account activation Email",
            html:`
            <h2>Hello ${name}!</h2>;
            <p>please click here to 
                <a href="${dev.app.clientUrl}/app/users/reset-password?token=${token}"
                terget="_blank">reset your password</a></p>
                `
        }
        sendEmailWithNodeMailer(emailData);
        res.status(200).json({
            ok:true,
            message:"email has been sent for resetting password",
            token:token,
        })
    } catch (error) {
        res.status(500).json({message:console.error.message})
    }
}

const resetPassword=async(req,res)=>{
    try {
        const {token}=req.body;
        if(!token){
            return res.status(404).json({message:"token is missing"})
        }

        jwt.verify(token, dev.app.jwtSecretKey, async function(err, decoded) {
            if(err){
                return res.status(401).json({message:"token is expired"})
            }
             const {email,hashedPassword}=decoded;
             const isExist=await  User.findOne({email:email});
             if(isExist){
                 return res.status(400).json({message:"user with this email already exist"})
             }
                //updating user
                const updateData=await  User.updateOne(
                    {email:email},
                    {$set:
                        {
                            password:hashedPassword,
                        }}
                    );
                    if(!updateData){
                        res.status(400).json({
                            message:" password was not resetted"})
                    }

          });
        res.status(200).json({
            message:"reset password was seccessfull"})
    } catch (error) {
        res.status(500).json({message:console.error.message})
    }

}

module.exports={registerUser,varifyEmail,loginUser,logoutUser,userProfile ,deleteUser,updateUser,forgetPassword,resetPassword}
