import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { CreateAccount } from '../controllers/acounts.controller.js'

const accountRouter = express.Router()

// this is basically a protected routes check authMiddleware
accountRouter.get("/ALL-Accounts",authMiddleware,(req,res)=>{
return res.status(200).json({
        message:"Account fetched SuccessFully"
    })
})

accountRouter.post("/",authMiddleware,CreateAccount)

export default accountRouter

