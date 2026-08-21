import mongoose from 'mongoose'
import accountModel from "../models/account.model.js";
import transactionModel from "../models/transaction.model.js";
import { createService } from "../services/transaction.service.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ledgerModel from '../models/ledger.model.js';

export const createTransaction = asyncHandler(async (req, res) => {
    // const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    const {statusCode, message,data} = await createService(req.body,req.user)


    return res.status(statusCode).json(new ApiResponse(message,data));

})


export const createInitialFundsTransaction = asyncHandler(async (req, res) => {
    const {toAccount, amount, idempotencyKey} = req.body;
    if (!toAccount || !amount || !idempotencyKey) throw new ApiError(400, "Please fill all the details");

    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!toUserAccount) throw new ApiError(400, "Invalid toAccount");

    const fromUserAccount = await accountModel.findOne({ 
        user: req.user._id,
        // systemUser: true
    });

    if (!fromUserAccount) throw new ApiError(400, "Invalid system user account");

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount: toUserAccount._id,
        amount,
        idempotencyKey,
        status: "PENDING"
    },);

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id, 
        amount,
        type: "DEBIT",
        transaction: transaction._id,
    }], {session});

    const creditLedgerEntry = await ledgerModel.create([{
        account: toUserAccount._id,
        amount,
        type: "CREDIT",
        transaction: transaction._id,
    }], {session});

    transaction.status = "COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(new ApiResponse("initial funds Transaction was completed",transaction));


})