import express from 'express'
import cookie from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import errorMiddleware from './middlewares/error.middleware.js'
import accountRouter from './routes/account.route.js'
import transactionRouter from './routes/transaction.route.js'

const app = express()
app.use(express.json())
app.use(cookie())

/**
 * - All the routes will be here
 * - All the middlewares will be here
 */

app.use("/api/auth",authRouter)

// account routes

app.use("/api/accounts",accountRouter)

// transaction routes

app.use("/api/transactions",transactionRouter)




app.use(errorMiddleware)


export default app