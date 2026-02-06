const express=require('express');
const router=express.Router();
const userAuth=require('../Middlewares/userAuth');
const User=require('../models/user.model')
const Connection=require('../models/connections.model');



router.post("/:status/:toId",userAuth,async(req,res)=>{
    try{
    const status=req.params.status;
    const toId=req.params.toId;
    const fromId=req.user._id;
    const allowedstatus=["like","ignore"]
    if(!allowedstatus.includes(status)){
        return res.json({message:"Invalid status"})
    }
    const touser=await User.findOne({_id:toId})
    if(!touser)
        return res.json({message:"This user doesnt exist"});
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



router.patch("/review", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { connectionId, action } = req.body;

    const validActions = ["accepted", "rejected", "ignore"];
    if (!validActions.includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const request = await Connection.findById(connectionId);
    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (request.toId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    request.status = action;
    await request.save();

    res.json({ message: `Request ${action} successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;