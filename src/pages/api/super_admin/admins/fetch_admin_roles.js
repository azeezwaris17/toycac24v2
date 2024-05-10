import connectDB from "../../mongodb";
import AdminAccountRegistration from "../../../../models/admin/create_account";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // Fetch all roles defined in the schema
    const roles = AdminAccountRegistration.schema.path("role").enumValues;
    // console.log(roles)

    return res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message,
    });
  }
}
