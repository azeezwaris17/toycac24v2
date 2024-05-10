import connectDB from "../../../mongodb";
import AdminAccountRegistration from "../../../../../models/admin/create_account";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { adminId } = req.query; // Retrieve adminId from query parameters

  if (!adminId) {
    return res
      .status(400)
      .json({ success: false, message: "AdminId is required" });
  }

  try {
    const admin = await AdminAccountRegistration.findByIdAndUpdate(
      adminId,
      { role: "admin" },
      { new: true }
    );

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Role revoked successfully", admin });
  } catch (error) {
    console.error("Error revoking role from admin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to revoke role from admin",
      error: error.message,
    });
  }
}
