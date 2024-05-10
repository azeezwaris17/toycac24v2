// [adminId].js

import connectDB from "../../../mongodb";
import AdminAccountRegistration from "../../../../../models/admin/create_account";
import nodemailer from "nodemailer"; // Import nodemailer

connectDB();

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { adminId } = req.query;
    console.log("Admin ID:", adminId);

    const admin = await AdminAccountRegistration.findById(adminId);
    console.log("Admin:", admin);

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // Update admin approval status
    admin.approved = true;
    await admin.save();

    // Send approval email to the admin
    // await sendApprovalEmail(admin.email, admin.fullName);

    // Return the updated admin object in the response payload
    return res
      .status(200)
      .json({ success: true, message: "Admin registration approved", admin });
  } catch (error) {
    console.error("Error approving admin registration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve admin registration",
      error: error.message,
    });
  }
}

async function sendApprovalEmail(email, fullName) {
  try {
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "api",
        pass: "2cd9d9b1e6bc374ddfc92aae1cf264d2",
      },
    });

    const mailOptions = {
      to: email,
      subject: "TOYCAC'24 - Registration Approved",
      text: `Dear ${fullName},\n\nYour registration for TOYCAC'24 has been approved by the admin.\n\nYou can now sign in using your credentials.\n\nThank you for registering!\n\nSincerely,\nThe TOYCAC'24 Committee`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw error; // Rethrow the error to be handled in the calling function
  }
}
