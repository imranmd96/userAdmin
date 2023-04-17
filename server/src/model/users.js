const {Schema,model}=require('mongoose');
const userSchema= new Schema({
    name:{
        type: String,
         required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        message:"enter your email"
    },
    password:{
        type: String,
        required: true,
        min:6,
    },
    phone:{
        type: String,
        required: true,
    },
    is_admin:{
        type: Number,
        default:0,
    },
    is_varified:{
        type: Number,
        default:0,
    },
    createdAt:{
        type: Date,
        default:Date.now,
    },
    image:{
        data:Buffer,
        contentType:String,
    },
})
const User=model("user",userSchema)
module.exports=User;