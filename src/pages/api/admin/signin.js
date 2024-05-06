const express = require("express");
const connectDB = require("../mongodb");
const AdminAccountRegistration = require("../../../models/admin/create_account");

const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

connectDB();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      // Find user by username (uniqueID)
      const admin = await AdminAccountRegistration.findOne({
        uniqueID: username,
      });

      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin not found" });
      }

      // Check if user account is approved
      if (!admin.approved) {
        return res.status(403).json({
          success: false,
          message: "Account is pending approval. Check back later.",
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }

      // Generate JWT token
      const token = admin.generateAuthToken();

      // Include username field in response
      const { uniqueID, fullName, email, phoneNumber, role, approved } = admin;

      res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        data: { uniqueID, fullName, email, phoneNumber, role, approved },
      });
    } catch (error) {
      console.error("Error logging in admin:", error.message);
      res.status(500).json({
        success: false,
        message: "Error logging in admin",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
