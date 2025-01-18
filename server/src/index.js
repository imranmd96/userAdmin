const express= require('express');
const morgan = require('morgan');
const dev = require('./config');
const connectDatabase = require('./config/db');
const userRoute  = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const adminRouter = require('./routes/admin');


const app=express()
const PORT=dev.app.serverPort;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"));
app.use("/api/users/",userRoute)
app.use("/api/admin/",adminRouter)

app.get("/", (req, res)=>{
    res.status(200).json({message:"SERVER STARTED HERE"})
})
app.listen(PORT ,async()=>{
console.log(`server is running  at http://localhost:${PORT}`);
await connectDatabase();
})