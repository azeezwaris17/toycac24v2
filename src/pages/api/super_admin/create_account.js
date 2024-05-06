// pages/api/super_admin/create_account.js

const express = require("express");
const connectDB = require("../mongodb");
const SuperAdminAccountRegistration = require("../../../models/super_admin/create_account");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

connectDB();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { fullName, email, phoneNumber, password } = req.body;

    // Check if all required fields are present
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate uniqueID for SuperAdmin
    const uniqueID = generateUniqueID();

    try {
      // Save SuperAdmin data to the database
      const superAdminAccountData = new SuperAdminAccountRegistration({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        uniqueID,
        // Add other fields as needed
      });
      await superAdminAccountData.save();

      // Send registration success email to the SuperAdmin
      // sendEmail(email, uniqueID);

      res.status(201).json({
        message: "SuperAdmin created successfully",
        fullName,
        email,
        uniqueID,
      });
    } catch (error) {
      console.error("Error creating superadmin:", error);
      res.status(500).json({
        message: "Internal Server Error - SuperAdmin creation failed",
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Utility function to send registration success email
function sendEmail(email, uniqueID) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject:
      "TIMSAN Oyo State Camp and Conference - SuperAdmin Registration Successful",
    text: `Dear SuperAdmin,\n\nYour registration as a SuperAdmin is successful. \n\nYou can sign in using the following credentials:\nUsername: ${uniqueID}\nPassword: Your registered password \n\nThank you.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Utility function to generate uniqueID for SuperAdmin
// Utility function to generate uniqueID for Admin
let counter = 0;

function generateUniqueID() {
  counter++;
  const paddedCounter = counter.toString().padStart(3, "0"); // Ensures 3 digits, padded with zeros if necessary
  return `TOYCA24-SADM-${paddedCounter}`;
}
