import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const mongoUri = process.env.DB_URI
    
    if(!mongoUri) {
      throw new Error("mongoUri is required");
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log("mongoDB is connected Succefully", conn.connection.host);
    
  } catch (error) {
    console.error("mongoDB connection failed: ", error.message);
    process.exit(1)
    // 1 means failiure and 0 means success
  }
}