// pages/api/super_admin/notifications/notifications.js

const express = require("express");
const connectDB = require("../../mongodb");
const SuperAdminAccountRegistration = require("../../../../models/super_admin/create_account");
const AdminAccountRegistration = require("../../../../models/admin/create_account");
const UserAccountRegistration = require("../../../../models/user/create_user_account");

const app = express();
app.use(express.json());

connectDB();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const superAdmin = await SuperAdminAccountRegistration.findById(req.user.id).populate("notifications");

      if (!superAdmin) {
        return res.status(404).json({ success: false, message: "Super admin not found" });
      }

      const notifications = superAdmin.notifications;

      res.json(notifications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else if (req.method === "POST") {
    const { recipient, message } = req.body;

    try {
      let recipients = [];

      // Handle different recipient scenarios
      switch (recipient) {
        case "allAdmins":
          recipients = await AdminAccountRegistration.find({});
          break;
        case "allUsers":
          recipients = await UserAccountRegistration.find({});
          break;
        // Add more cases for other recipient scenarios
        default:
          // Check if the recipient is a specific user or admin
          const isSuperAdmin = await SuperAdminAccountRegistration.findById(recipient);
          const isAdmin = await AdminAccountRegistration.findById(recipient);
          const isUser = await UserAccountRegistration.findById(recipient);

          if (isSuperAdmin) {
            recipients.push(isSuperAdmin);
          } else if (isAdmin) {
            recipients.push(isAdmin);
          } else if (isUser) {
            recipients.push(isUser);
          } else {
            return res.status(404).json({ success: false, message: "Recipient not found" });
          }
          break;
      }

      // Save notification for each recipient
      for (const recipient of recipients) {
        const newNotification = {
          sender: req.user.id,
          recipient: recipient._id,
          message,
        };

        recipient.notifications.push(newNotification);
        await recipient.save();
      }

      res.json({ success: true, message: "Notification sent successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
