import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { CreateAccount, GetAccountBalance, GetUserAccounts } from '../controllers/accounts.controller.js'

const accountRouter = express.Router()

// this is basically a protected routes check authMiddleware
// accountRouter.get("/ALL-Accounts",authMiddleware,(req,res)=>{
// return res.status(200).json({
//         message:"Account fetched SuccessFully"
//     })
// })

accountRouter.post("/",authMiddleware,CreateAccount)

/**
 * - GET /api/accounts (GET)
 * - Get all accounts OF the login user
 * - Protected route
 */

accountRouter.get("/",authMiddleware,GetUserAccounts)

/**
 * - GET /api/accounts/balance/:accountId (GET)
 */

accountRouter.get("/balance/:accountId",authMiddleware,GetAccountBalance)

export default accountRouter

