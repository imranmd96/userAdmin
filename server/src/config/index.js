const dotenv=require("dotenv").config()

const dev ={
    app:{
        serverPort:process.env.SERVER_PORT || 3001,
        jwtSecretKey:process.env.JWT_SECRET_KEY,
        smptUserName:process.env.SMPT_USERNAME,
        smptPassword:process.env.SMTP_PASSWORD,
        clientUrl:process.env.CLIENT_URL,
        sessionSecretKey:process.env.SESSION_SECRET_KEY,
    },
    db:{url:process.env.MONGO_URL}
}
module.exports=dev

