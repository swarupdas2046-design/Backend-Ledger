import "dotenv/config"
import app from "./src/app.js"
import connectDB from "./src/config/database.js"

const port = Number(process.env.PORT) || 5000

connectDB()

app.listen(port, () => {
    console.log(`Server running on port`, port)
})




