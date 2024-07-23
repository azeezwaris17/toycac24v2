import express from "express";
import bcrypt from "bcrypt";
import connectDB from "../mongodb";
import User from "../../../models/user/create_user_account";

// Initialize express app
const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Handler function for the /forgot-password endpoint
const handler = async (req, res) => {
  // Only handle POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract email and newPassword from the request body
  const { email } = req.body;

  try {
    // Check if the user with the given email exists in the database
    const user = await User.findOne({ email });

    // If the user does not exist, respond with a 404 status and error message
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // if user exist
    res.status(200).json({ message: "Email found." });
  } catch (err) {
    // Log any errors and respond with a 500 status and error message
    console.error("Error while finding email:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Export the handler function to be used as an API endpoint
export default handler;
