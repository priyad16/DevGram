const connectToDB=require('./DBConnection/ConnectToDB');
const express=require('express');
const cookieParser=require('cookie-parser')
const cors=require('cors')
const app=express();
require("dotenv").config();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())

const authrouter=require('./routes/auth.router')
const connectionrouter=require('./routes/connection.router')
const userrouter=require('./routes/user.router')
const profilerouter=require('./routes/profile.router')

app.use("/auth",authrouter);
app.use("/connection",connectionrouter);
app.use("/user",userrouter);
app.use("/profile",profilerouter);

connectToDB()
.then(()=>{
    console.log("connection established sucesssfully");
    app.listen(3000,()=>{
        console.log("server running on port 3000");
    })
})
.catch((err)=>{
    console.log("error in connecting to DB",err);
})

