import mongoose from "mongoose";
import ledgerModel from "./ledger.model.js";

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

accountSchema.methods.getBalance = async function(){
    const balanceData = await ledgerModel.aggregate([
        {$match:{account:this._id}},
        {
        
        $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
        }
        },
        {
            $project:{
                _id:0,
                balance:{$subtract:["$totalCredit","$totalDebit"]}
            }
        }

        
    ])

    if(balanceData.length === 0){
        return 0
    }
    return balanceData[0].balance
}


// Create and export the UserAuth model based on the authSchema
const accountModel = mongoose.model("Account",accountSchema)

export default accountModel
