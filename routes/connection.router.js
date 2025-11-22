const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const jwt_secret="secret"
const User=require('../models/user.model')
const Connection=require('../models/connections.model');

const userAuth=async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token)
       return res.send("please login to continue");
    const id=await jwt.verify(token,jwt_secret);
    const user=await User.findById(id);
    if(!user)
        return res.send("Invalid user please login to continue")
    req.user=user
    next();
}

router.post("/:status/:toId",userAuth,async(req,res)=>{
    try{
    const status=req.params.status;
    const toId=req.params.toId;
    const fromId=req.user._id;
    const allowedstatus=["like","ignore"]
    if(!allowedstatus.includes(status)){
        return res.json({message:"Invalid status"})
    }
    const existingconnection= await Connection.findOne({$or:[{fromId:fromId,toId:toId},{fromId:toId,toId:fromId}]})
    if(existingconnection)
        return res.json({message:"connection already exists"})
    const con=new Connection({
        fromId,toId,status:status.toLowerCase()
    })
    await con.save();
    return res.json({message:"connection sent sucessfully"})
    }
    catch(err){
        res.send("Error: "+err);
    }

})
module.exports=router;