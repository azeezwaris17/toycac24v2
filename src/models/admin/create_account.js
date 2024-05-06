const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Generate a random JWT secret
const jwtSecret = crypto.randomBytes(64).toString("hex");

// Define the schema
const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  uniqueID: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "admin",
      "Health Team Lead",
      "Media Team Lead",
      "Welfare Team Lead",
      "Sports Team Lead",
      "Protocol Team Lead",
    ],
    default: "admin",
  },
  approved: { type: Boolean, default: false },
});

// Method to compare password for user signin
adminSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to generate JWT token for user signin
adminSchema.methods.generateAuthToken = function () {
  const payload = {
    user: {
      id: this._id,
      username: this.uniqueID,
      role: this.role, // Include role
    },
  };
  return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
};

// Check if the model already exists before defining it
const AdminAccountRegistration =
  mongoose.models.AdminAccountRegistration ||
  mongoose.model("AdminAccountRegistration", adminSchema);

module.exports = AdminAccountRegistration;
