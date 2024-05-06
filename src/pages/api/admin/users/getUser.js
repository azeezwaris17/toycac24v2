const express = require("express");
const connectDB = require("../../mongodb");
const UserAccountRegistration = require("../../../../models/user/create_user_account");

const app = express();
app.use(express.json());

connectDB();

export default async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await UserAccountRegistration.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}
