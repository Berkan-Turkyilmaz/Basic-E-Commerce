import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        const connectDB = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB connected: ${connectDB.connection.host}`)

    } catch (error) {
        process.exit(1);
    }
}
export default connectMongoDB