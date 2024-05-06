const express = require("express");
const connectDB = require("../mongodb");
const UserAccountRegistration = require("../../../models/user/create_user_account");

const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

connectDB();

// Signin endpoint
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      // Find user by username (uniqueID)
      const user = await UserAccountRegistration.findOne({
        uniqueID: username,
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid username or password" });
      }

      // Check if user account is approved
      if (!user.approved) {
        return res.status(403).json({
          success: false,
          message: "Account is pending approval. Check back later.",
        });
      }

      // Compare password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }

      // Generate JWT token
      const token = user.generateAuthToken();

      // Include user data in response
      const { uniqueID, fullName, email, phoneNumber, role, approved } = user;

      res.status(200).json({
        success: true,
        message: "User login successful",
        token,
        data: { uniqueID, fullName, email, phoneNumber, role, approved },
      });
    } catch (error) {
      console.error("Error logging in user:", error.message);
      res.status(500).json({
        success: false,
        message: "Error logging in user",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
