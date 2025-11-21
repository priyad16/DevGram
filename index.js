const connectToDB=require('./DBConnection/ConnectToDB');
const express=require('express');
const app=express();
app.use(express.json());
const authrouter=require('./routes/auth.router')
app.use("/auth",authrouter);
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

