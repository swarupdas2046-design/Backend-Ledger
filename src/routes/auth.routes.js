import express from 'express'
import { GetRefresh, UserLogin, UserRegister } from '../controllers/auth.controller.js'
import ApiResponse from '../utils/apiResponse.js'
import authMiddleware from '../middlewares/auth.middleware.js'


const authRouter = express.Router()

/**
 * - All the auth routes will be here
 * - /api/auth/register (POST) - User registration
 */

authRouter.post('/register',UserRegister)

/**
 * - /api/auth/login (POST) - User login
 */

authRouter.post("/login",UserLogin)

/**
 * - /api/auth/getRefresh (GET) - Get refresh token
 */

authRouter.get("/getRefresh",GetRefresh)

authRouter.get("/health", authMiddleware, (req, res) => {
    res.status(200).json(new ApiResponse("Healthy, you're Authenticated ! :)",req.user))
})




export default authRouter