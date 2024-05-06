import connectDB from "../../mongodb";
import UserAccountRegistration from "../../../../models/user/create_user_account";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId } = req.query;
    console.log("User ID:", userId);

    const user = await UserAccountRegistration.findById(userId);
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user approval status
    user.approved = true;
    await user.save();

    // Send approval email to the user
    // Assuming you have a function sendApprovalEmail defined somewhere
    // await sendApprovalEmail(user.email, user.fullName);

    // Return the updated user object in the response payload
    return res
      .status(200)
      .json({ message: "User registration approved", user });
  } catch (error) {
    console.error("Error approving user registration:", error);
    return res
      .status(500)
      .json({ message: "Failed to approve user registration" });
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
  }
}
