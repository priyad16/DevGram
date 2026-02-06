const express=require('express');
const router=express.Router();

const bcrypt=require('bcrypt');
const user=require('../models/user.model.js')

const jwt=require('jsonwebtoken');

router.post("/signup",async(req,res)=>{
    const {firstName,lastName,email,password,gender}=req.body;
    try{
    if(!firstName||!lastName||!email||!password||!gender){
        return res.status(400).json({message:"all fields are required",success:false});
    }
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
        success: false,
      });
    }
    const hpassword=await bcrypt.hash(password,10);
    const newuser=new user({
        firstName,lastName,email,password:hpassword,gender
    })
    await newuser.save();
    return res.status(201).send("user added sucessfully");
    }
    catch (err) {
  console.log("SIGNUP ERROR ", err.message);
  return res.status(400).json({
    message: err.message,
    success: false,
  });
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
    const token=jwt.sign({_id:finduser._id},process.env.JWT_SECRET,{expiresIn:"8h"})
     res.cookie("token",token)
     return res.status(200).send(finduser);
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