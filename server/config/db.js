import mongoose from "mongoose";

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is not set. Add it in your Render service Environment settings."
    );
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected");
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}
