import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully ✅");
    } catch (error) {
        console.log("Database connection error ❌", error);
        process.exit(1);
    }
}


export default connectDB