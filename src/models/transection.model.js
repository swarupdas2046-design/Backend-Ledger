import mongoose from 'mongoose'
const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must have associated with a from user"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must have associated with a to user"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status must be PENDING, COMPLETED, FAILED or REVERSED"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"amount required for creation of transaction"],
        min:[0,"Transaction amount cannot be negative"],
    },
    idempotencyKey:{
        type:String,
        required:[true,"idempotencyKey required for creation of transaction"],
        unique:true,
        index:true
    }
},{timestamps:true})

const transactionModel = mongoose.model("Transaction",transactionSchema)
export default transactionModel