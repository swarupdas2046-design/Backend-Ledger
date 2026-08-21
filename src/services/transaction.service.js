import mongoose from "mongoose";
import accountModel from "../models/account.model.js";
import transactionModel from "../models/transaction.model.js";
import ApiError from "../utils/apiError.js";
import ledgerModel from "../models/ledger.model.js";
import { SendTransactionEmail } from "../utils/emailTemplate.js";

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */


export const createService = async({fromAccount, toAccount, amount, idempotencyKey}, user) => {
    /**
     * - checking ALL the validations
     */
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) throw new ApiError(400, "Please fill all the details");

    if (amount < 0) throw new ApiError(400, "Transaction amount cannot be negative");

    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);

    if (!fromUserAccount || !toUserAccount) throw new ApiError(400, "Invalid fromAccount or toAccount");

    /** 
     * - checking if transaction already exists
     * - validate idempotency Key
    */

    const isTransactionExists = await transactionModel.findOne({ idempotencyKey: idempotencyKey });


    if (isTransactionExists) {
    if (isTransactionExists.status === "COMPLETED") {
        return {
            statusCode: 200,
            message: "Transaction was completed",
            data: isTransactionExists
        };
    }

    if (isTransactionExists.status === "FAILED") {
        throw new ApiError(409, "Transaction was failed please try again");
    }

    if (isTransactionExists.status === "PENDING") {
        return {
            statusCode: 202,
            message: "Transaction still processing",
            data: isTransactionExists
        };
    }

    if (isTransactionExists.status === "REVERSED") {
        throw new ApiError(409, "Transaction was reversed please try again");
    }
}

    /**
     * - check account status
     */

    if(fromUserAccount.status !== "Active" || toUserAccount.status !== "Active") throw new ApiError(400, "Both From and To accounts must be active to process the transaction");

    /**
     * - derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) throw new ApiError(400, `Insufficient balance. You have ${balance} in your account. Requested amount is ${amount}`);

    /**
     * 5. Create transaction (PENDING)
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    const newTransaction =( await transactionModel.create([{
        fromAccount,
        toAccount,
        status: "PENDING",
        amount,
        idempotencyKey
    }], { session }))[0];

    /**
     * 6. Create DEBIT ledger entry
     */
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        type: "DEBIT",
        amount,
        transaction: newTransaction._id
    }], { session });

        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
        })()

    /**
     * 7. Create CREDIT ledger entry
     */
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        type: "CREDIT",
        amount,
        transaction: newTransaction._id
    }], { session });

    /**
     * 8. Mark transaction COMPLETED
     */
    // newTransaction.status = "COMPLETED";
    // await newTransaction.save({ session });

  await transactionModel.findOneAndUpdate(
            { _id: newTransaction._id },
            { status: "COMPLETED" },
            { session }
        )

    /**
     * 9. Commit MongoDB session
     */
    await session.commitTransaction();
    session.endSession();

    /**
     * 10. Send email notification
     */
    await SendTransactionEmail(user.email,user.name,amount,toAccount)

    return {
        statusCode: 200,
        message: "Transaction completed successfully",
        data: newTransaction
    };

} 