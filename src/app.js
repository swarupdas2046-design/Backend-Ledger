import express from 'express'
import cookie from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import errorMiddleware from './middlewares/error.middleware.js'

const app = express()
app.use(express.json())
app.use(cookie())

/**
 * - All the routes will be here
 * - All the middlewares will be here
 */

app.use("/api/auth",authRouter)





app.use(errorMiddleware)


export default app