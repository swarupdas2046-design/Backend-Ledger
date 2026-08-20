import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserAuth",
        required:[true,"account must have associated with a user"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["Active","Frozen","Closed"],
            message:"Status must be Active, Frozen or Closed"
        },
        default:"Active"
    },
    currency:{
        type:String,
        required:[true,"currency required for creation of account"],
        default:"INR"
    },
},{timestamps:true})

accountSchema.index({user:1,status:1})


// Create and export the UserAuth model based on the authSchema
const accountModel = mongoose.model("Account",accountSchema)

export default accountModel