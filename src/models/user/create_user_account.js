const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  homeAddress: { type: String, default: "" },
  category: { type: String, required: true },
  institution: { type: String },
  yearOfGraduation: { type: String },
  guardianName: { type: String },
  guardianPhoneNumber: { type: String },
  medicalCondition: { type: String, default: "" },
  healthCondition: { type: String, default: "" },
  proofOfPayment: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  uniqueID: { type: String, required: true },
  approved: { type: Boolean, default: false },
});

userSchema.pre("validate", function (next) {
  // Adjust validation based on category
  if (this.category === "student") {
    // If category is student, require institution, remove other fields' requirement
    if (!this.institution) {
      this.invalidate(
        "institution",
        "Institution is required for student category."
      );
    }
    this.yearOfGraduation = undefined;
    this.guardianName = undefined;
    this.guardianPhoneNumber = undefined;
  } else if (this.category === "iotb") {
    // If category is IOTB, require yearOfGraduation and institution, remove other fields' requirement
    if (!this.yearOfGraduation) {
      this.invalidate(
        "yearOfGraduation",
        "Year of Graduation is required for IOTB category."
      );
    }
    if (!this.institution) {
      this.invalidate(
        "institution",
        "Institution is required for IOTB category."
      );
    }

    this.guardianName = undefined;
    this.guardianPhoneNumber = undefined;
  } else if (this.category === "children") {
    // If category is children, require guardianName and guardianPhoneNumber, remove other fields' requirement
    if (!this.guardianName) {
      this.invalidate(
        "guardianName",
        "Guardian Name is required for children category."
      );
    }
    if (!this.guardianPhoneNumber) {
      this.invalidate(
        "guardianPhoneNumber",
        "Guardian Phone Number is required for children category."
      );
    }
    this.institution = undefined;
    this.yearOfGraduation = undefined;
  }

  else if (this.category === "nonTimsanite") { // New category
    // Additional fields required for Non-Timsanites category
    if (!this.healthCondition) {
      this.invalidate(
        "healthCondition",
        "Kindly specify what you're allergic to"
      );
    }
    // Other fields for Non-Timsanites category validation can be added here
    this.institution = undefined;
    this.yearOfGraduation = undefined;
    this.guardianName = undefined;
    this.guardianPhoneNumber = undefined;
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generateAuthToken = function () {
  const payload = {
    user: {
      id: this._id,
      username: this.uniqueID,
      role: this.role,
    },
  };
  return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
};

const UserAccountRegistration =
  mongoose.models.UserAccountRegistration ||
  mongoose.model("UserAccountRegistration", userSchema);

module.exports = UserAccountRegistration;
