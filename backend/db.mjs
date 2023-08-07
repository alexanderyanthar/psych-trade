import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/PsychTradeDB');
        console.log('Connected to database');
    } catch (err) {
        console.error('Error onnectiong ot database:', err.message);
        process.exit(1);
    }
}

export default connectDB;