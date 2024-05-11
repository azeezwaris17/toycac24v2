import express from "express";
import connectDB from "../mongodb";
import AdminAccountRegistration from "../../../models/admin/create_account";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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
     const existingAdmin = await AdminAccountRegistration.findOne({ email: req.body.email });
     if (existingAdmin) {
       // If the email exists, send an appropriate error response to the user
       return res.status(400).json({ message: "This email has been registered, try another one" });
     }

    try {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate uniqueID for SuperAdmin
      const uniqueID = await generateUniqueID();

      // Save SuperAdmin data to the database
      const adminAccountData = new AdminAccountRegistration({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        uniqueID,
        // Add other fields as needed
      });
      await adminAccountData.save();

      // Send registration success email to the SuperAdmin
      await sendEmail(email, fullName, uniqueID);

      res.status(201).json({
        message: "Registration successful",
        fullName,
        email,
        uniqueID,
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({
        message: "Internal Server Error - Admin creation failed",
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Utility function to generate uniqueID for Admin
async function generateUniqueID() {
  try {
    const lastAdmin = await AdminAccountRegistration.findOne().sort({$natural:-1}).limit(1);
    if (lastAdmin) {
      const lastUniqueID = lastAdmin.uniqueID;
      const lastCounter = parseInt(lastUniqueID.split("-")[2]);
      const paddedCounter = (lastCounter + 1).toString().padStart(3, "0");
      return `TOYCAC24-ADM-${paddedCounter}`;
    } else {
      // If there are no admins in the database yet
      return `TOYCAC24-ADM-001`;
    }
  } catch (error) {
    console.error("Error generating unique ID for admin:", error);
    throw new Error("Failed to generate unique ID for admin");
  }
}

async function sendEmail(email, fullName, uniqueID) {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "02bb5fb91b8ca2",
        pass: "77276fdc826b5b",
      },
    });

    const mailOptions = {
      from: '"TOYCAC24 Committee" <timsanoyostate@gmail.com>',
      to: email,
      subject: "TOYCAC'24 - Registration Successful",
      text: `Dear ${fullName},\n\nYour registration as TOYCAC'24 Admin has been successfully submitted. Your registration is pending approval by the Super Admin.\n\nOnce approved, you can sign in using the following credentials:\nUsername: ${uniqueID}\nPassword: Your registered password \n\nThank you!`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
