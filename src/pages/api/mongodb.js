// db.js

// const mongoose = require("mongoose");

// // Connect to MongoDB
// const connectDB = async (MONGODB_URI) => {
//   try {
//     await mongoose.connect(MONGODB_URI, {
//       // useNewUrlParser: true,
//       // useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 30000, // 30 seconds timeout
//       socketTimeoutMS: 45000, // 45 seconds timeout
//     });
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("Database connection error:", error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv").config();

// console.log(process.env);

const { MONGODB_URI } = process.env;
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
