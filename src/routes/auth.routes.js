import express from 'express'
import { UserRegister } from '../controllers/auth.controller.js'


const authRouter = express.Router()

/**
 * - All the auth routes will be here
 * - /api/auth/register (POST) - User registration
 */

authRouter.post('/register',UserRegister)


export default authRouter