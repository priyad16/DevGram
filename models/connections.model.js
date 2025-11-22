const mongoose=require('mongoose');
const connectionschema=mongoose.Schema({
    fromId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:["like","aceepted","rejected","ignore"],
        required:true
    }
},{timestamps:true})

connectionschema.pre("save", async function(next){
  const connection = this;
  if(connection.fromId.equals(connection.toId)){
    throw new Error("You cannot connect to yourself");
  }

  next();
});

const connectionsmodel=mongoose.model("connections",connectionschema);
module.exports=connectionsmodel;