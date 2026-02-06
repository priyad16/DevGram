const express=require('express');
const router=express.Router();
const userAuth=require('../Middlewares/userAuth');
const User=require('../models/user.model');
const Connection=require('../models/connections.model');

router.get("/friendreq",userAuth,async(req,res)=>{
    try{
    const {_id}=req.user
    const requests=await Connection.find({toId:_id,status:"like"}).populate("fromId","firstName bio skills");
    if(requests.length==0)
        return res.json({message:"No new Friend requests"});
    return res.json({requests});
    }
    catch(err){
        res.send("error: "+err);
    }
})

router.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await Connection.find({
      $or: [
        { fromId: loggedInUser._id, status: "accepted" },
        { toId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromId", "firstName bio skills")
      .populate("toId", "firstName bio skills");
// console.log(connections);
    const filteredConnections = connections.map((connection) => {
      if (connection.fromId._id.equals(loggedInUser._id)) {
        return connection.toId;
      }
      return connection.fromId;
    });

    res.json({
      data: filteredConnections,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});


router.get("/feed", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [{ fromId: userId }, { toId: userId }]
    });

    const ignoreSet = new Set();
    connections.forEach(conn => {
      ignoreSet.add(conn.fromId.toString());
      ignoreSet.add(conn.toId.toString());
    });

    ignoreSet.add(userId.toString());

    const feedUsers = await User.find({
      _id: { $nin: Array.from(ignoreSet) }
    }).select("firstName lastName bio skills avatar "); 

    res.json({ feed: feedUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;