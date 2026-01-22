const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    console.log(`Connecting to MongoDB...`); 
    
    // PHẢI CÓ DÒNG NÀY ĐỂ KẾT NỐI
    const conn = await mongoose.connect(uri); 

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;