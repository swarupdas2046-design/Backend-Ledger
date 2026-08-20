import accountModel from "../models/account.model.js";
import transactionModel from "../models/transaction.model.js";
import ApiError from "../utils/apiError.js";

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


export const createService = async(fromAccount, toAccount, amount, idempotencyKey) => {
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


    if(isTransactionExists) return {isTransactionExists}

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") throw new ApiError(400, "Both fromAccount and toAccount must be active to perform a transaction");
}