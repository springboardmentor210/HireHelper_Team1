import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("⚠️ Database Connection Warning: Local MongoDB is not running.");
    console.error(error.message);
  }
};

export default connectDB;