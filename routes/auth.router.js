const express=require('express');
const router=express.Router();

const bcrypt=require('bcrypt');
const user=require('../models/user.model.js')
const jwt_secret="secret"
const jwt=require('jsonwebtoken');

router.post("/signup",async(req,res)=>{
    const {firstName,lastName,email,password}=req.body;
    try{
    if(!firstName||!lastName||!email||!password){
        return res.status(400).json({message:"all fields are required",success:false});
    }
    const hpassword=await bcrypt.hash(password,10);
    const newuser=new user({
        firstName,lastName,email,password:hpassword
    })
    await newuser.save();
    return res.status(201).send("user added sucessfully");
    }
    catch(err){
        res.status(400).send("error"+err);
    }
    
})

router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
    const finduser=await user.findOne({email:email});
    if(!finduser)
       return res.json({message:"cannot find user"});
    const vpass=await bcrypt.compare(password,finduser.password);
    if(!vpass)
       return res.json({message:"invalid password"});
    const token=jwt.sign({_id:finduser._id},jwt_secret,{expiresIn:"8h"})
     res.cookie("token",token)
     return res.status(200).send("login sucessfull!")
    }
    catch(err){
        res.send("error"+err)
    }


})
router.post("/logout",(req,res)=>{
    res.cookie("token",null)
    return res.json("logged out sucessfully!")
})
module.exports=router