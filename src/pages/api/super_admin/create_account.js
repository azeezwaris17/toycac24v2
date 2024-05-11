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

     // Check if the email already exists
     const existingSuperAdmin = await SuperAdminAccountRegistration.findOne({ email: req.body.email });
     if (existingSuperAdmin) {
       // If the email exists, send an appropriate error response to the user
       return res.status(400).json({ message: "This email has been registered, try another one" });
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
let counter = 0;

// Utility function to generate uniqueID for Admin
async function generateUniqueID() {
  try {
    const lastAdmin = await SuperAdminAccountRegistration.findOne().sort({$natural:-1}).limit(1);
    if (lastAdmin) {
      const lastUniqueID = lastAdmin.uniqueID;
      const lastCounter = parseInt(lastUniqueID.split("-")[2]);
      const paddedCounter = (lastCounter + 1).toString().padStart(3, "0");
      return `TOYCAC24-SADM-${paddedCounter}`;
    } else {
      // If there are no admins in the database yet
      return `TOYCAC24-SADM-001`;
    }
  } catch (error) {
    console.error("Error generating unique ID for admin:", error);
    throw new Error("Failed to generate unique ID for admin");
  }
}
