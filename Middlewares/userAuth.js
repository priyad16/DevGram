const jwt=require('jsonwebtoken');
const jwt_secret="secret"
const User=require('../models/user.model')

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
module.exports=userAuth;