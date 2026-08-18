import express from 'express'
import { UserLogin, UserRegister } from '../controllers/auth.controller.js'


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




export default authRouter