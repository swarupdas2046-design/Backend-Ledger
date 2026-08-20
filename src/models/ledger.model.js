import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Ledger must have associated with an account"],
        index:true,
        immutable:true // cannot be updated after creation
    },
    amount:{
        type:Number,
        required:[true,"amount required for creation of ledger entry"],
        immutable:true // cannot be updated after creation
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction",
        required:[true,"Ledger must have associated with a transaction"],
        index:true,
        immutable:true // cannot be updated after creation
    },
    type:{
        type:String,
        enum:{
            values:["DEBIT","CREDIT"],
            message:"Type must be DEBIT or CREDIT",
        },
        required:[true,"Type required for creation of ledger entry"],
        immutable:true // cannot be updated after creation
    },

},{timestamps:true})

// create function to prevent ledger modification
function PreventLedgerModification(){
    throw new ApiError(400, "Ledger entries are immutable and cannot be modified or deleted")
}
// prevent ledger modification
ledgerSchema.pre("updateOne",PreventLedgerModification)
ledgerSchema.pre("updateMany",PreventLedgerModification)
ledgerSchema.pre("deleteOne",PreventLedgerModification)
ledgerSchema.pre("deleteMany",PreventLedgerModification)
ledgerSchema.pre("findOneAndDelete",PreventLedgerModification)
ledgerSchema.pre("findOneAndUpdate",PreventLedgerModification)
ledgerSchema.pre("remove",PreventLedgerModification)
ledgerSchema.pre("findOneAndRemove",PreventLedgerModification)
ledgerSchema.pre("findOneAndReplace",PreventLedgerModification)


const ledgerModel = mongoose.model("Ledger",ledgerSchema)
export default ledgerModel


