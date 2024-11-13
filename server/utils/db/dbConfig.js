import mongoose from 'mongoose'
import 'dotenv/config'

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL);
        console.log("Db connected successfully. => ", process.env.MONGO_URL);
    } catch (error) {
        console.log("Error Occured while connecting to mongodb.\n", error);
        throw error;
    }
}

export default connectDB;