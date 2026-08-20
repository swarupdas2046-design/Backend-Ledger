import ledgerModel from "../models/ledger.model.js";
import transactionModel from "../models/transaction.model.js";
import { createService } from "../services/transaction.service.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { SendTransactionEmail, SendTransactionFailedEmail } from "../utils/emailTemplate.js";

const createTransaction = asyncHandler(async (req, res) => {
    // const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    const {isTransactionExists} = await createService(req.body)

    /**
     * - checking if transaction already exists
     */

    if (isTransactionExists) {
        if (isTransactionExists.status === "COMPLETED") {
            return res.status(201).json(new ApiResponse("Transaction was completed",isTransactionExists));
        }
        if(isTransactionExists.status === "FAILED") throw new ApiError(500, "Transaction was failed please try again");
        
        if(isTransactionExists.status === "PENDING") {
            return res.status(200).json(new ApiResponse("Transaction Still Processing"));
        }
        
        if(isTransactionExists.status === "REVERSED") throw new ApiError(500, "Transaction was reversed please try again");
    }


})