// api/super_admin/[adminId].js
import connectDB from "../../../mongodb";
import AdminAccountRegistration from "../../../../../models/admin/create_account";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { adminId } = req.query;
  const { roleId } = req.body; // Expect roleId in the request body

  if (!adminId || !roleId) {
    return res
      .status(400)
      .json({ success: false, message: "AdminId and RoleId are required" });
  }

  try {
    const admin = await AdminAccountRegistration.findByIdAndUpdate(
      adminId,
      { role: roleId },
      { new: true }
    );

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Role assigned successfully", admin });
  } catch (error) {
    console.error("Error assigning role to admin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign role to admin",
      error: error.message,
    });
  }
}
