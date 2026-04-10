const mongoose=require("mongoose");
const { type } = require("node:os");
const { ref } = require("node:process");
const TransactionSchema= new mongoose.Schema(
    {
        transactionId:{
            type:String,
            required:true,
            unique:true,
        },
     from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
     },
     to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
     },
    type:{
        type:String,
        enum:["DEPOSIT","WITHDRAW","TRANSFER"],
        required:true,
    },
    status:{
        type:String,
        enum:["PENDING","SUCCESS","FAILED"],
        default:"PENDING",
    },
},
{timestamps:true});

module.exports=mongoose.model("Transactions",TransactionSchema);
