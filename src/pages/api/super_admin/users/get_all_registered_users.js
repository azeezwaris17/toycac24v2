const express = require("express");
const connectDB = require("../../mongodb");
const UserAccountRegistration = require("../../../../models/user/create_user_account");

const app = express();
app.use(express.json());

connectDB();

export default async function getUsers(req, res) {
  try {
    const users = await UserAccountRegistration.find();
    const usersWithImageUrl = users.map((user) => ({
      ...user.toObject(),
      imageUrl: `${user.proofOfPayment}`, // Assuming proofOfPayment is the file name
    }));
    res.status(200).json(usersWithImageUrl);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}
