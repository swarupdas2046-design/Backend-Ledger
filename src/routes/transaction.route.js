import express from 'express'
import authMiddleware, { authSystemMiddleware } from '../middlewares/auth.middleware.js'
import { createInitialFundsTransaction, createTransaction } from '../controllers/transaction.controller.js'


const transactionRouter = express.Router()


transactionRouter.post("/",authMiddleware,createTransaction)


/**
 * - POST /api/transactions/system/initial-funds
 * - create initial funds transaction foe system user
 */

transactionRouter.post("/system/initial-funds",authSystemMiddleware,createInitialFundsTransaction)

export default transactionRouter