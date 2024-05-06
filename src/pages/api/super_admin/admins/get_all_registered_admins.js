const express = require("express");
const connectDB = require("../../mongodb");
const AdminAccountRegistration = require("../../../../models/admin/create_account");

const app = express();
app.use(express.json());

connectDB();

export default async function getUsers(req, res) {
  try {
    const admins = await AdminAccountRegistration.find();

    res
      .status(200)
      .json({ success: true, message: "admins fetch successuly", admins });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
}
