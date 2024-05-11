const mongoose = require("mongoose");
require("dotenv").config();

// console.log(process.env);

const MONGODB_URI  = process.env.MONGODB_URI;
// console.log(MONGODB_URI);

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

module.exports = connectDB;
