const express = require("express");
const connectDB = require("../mongodb");
const SuperAdminAccountRegistration = require("../../../models/super_admin/create_account");

const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

connectDB();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      // Find user by username (uniqueID)
      const user = await SuperAdminAccountRegistration.findOne({
        uniqueID: username,
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }

      // Generate JWT token
      const token = user.generateAuthToken();

      // Include super admin data in response
      const { uniqueID, fullName, email, phoneNumber, role } = user;

      res.status(200).json({
        success: true,
        message: "Super Admin login successful",
        token,
        data: { uniqueID, fullName, email, phoneNumber, role },
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
