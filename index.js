const connectToDB=require('./DBConnection/ConnectToDB');
const express=require('express');
const cookieParser=require('cookie-parser')

const app=express();

app.use(express.json());
app.use(cookieParser())

const authrouter=require('./routes/auth.router')
const connectionrouter=require('./routes/connection.router')

app.use("/auth",authrouter);
app.use("/connection",connectionrouter);

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

