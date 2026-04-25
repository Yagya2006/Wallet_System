const mongoose = require("mongoose");
const { timeStamp } = require("node:console");
const { type } = require("node:os");

const userSchema = new mongoose.Schema(
  {
  name:{
    type: String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  phoneNumber:{
    type:String,
    required:true,
  },
  address:{
    type:String,
  },
},
{timestamps:true
});

module.exports = mongoose.model("User", userSchema);