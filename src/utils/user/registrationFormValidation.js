import { toast } from "react-hot-toast";

// Validate user input
export const validateRegistrationFormData = (data) => {
  const {
    fullName,
    email,
    phoneNumber,
    homeAddress,
    category,
    institution,
    yearOfGraduation,
    guardianName,
    guardianPhoneNumber,
    medicalCondition,
    proofOfPayment,
    password,
    confirmPassword,
  } = data;

  // Check if any required field is empty
  if (
    !fullName ||
    !email ||
    !phoneNumber ||
    !category ||
    !proofOfPayment ||
    !password ||
    !confirmPassword
  ) {
    toast.error("Please fill in all required fields.");
    return false; // Return false if any field is empty
  }

  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address.");
    return false;
  }

  // Check if phoneNumber is valid
  const phoneRegex = /^(\+?234)?[0-9]{11}$/;
  if (!phoneRegex.test(phoneNumber)) {
    toast.error("Please enter a valid phone number.");
    return false;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return false;
  }

  // Check password strength
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long.");
    return false;
  }

  // Add more specific validation rules here if needed for each category
  if (category === "student") {
    if (!data.institution) {
      toast.error("Please fill in all student-specific fields.");
      return false;
    }
  } else if (category === "iotb") {
    // Add specific validation rules for IOTB category
    // For example, check if yearOfGraduation is provided
    if (!data.institution || !data.yearOfGraduation) {
      toast.error("Please fill in the year of graduation for IOTB category.");
      return false;
    }
  } else if (category === "children") {
    // Add specific validation rules for Children category
    // For example, check if guardianName and guardianPhoneNumber are provided
    if (!data.guardianName || !data.guardianPhoneNumber) {
      toast.error("Please fill in all children-specific fields.");
      return false;
    }
  }

  // Function to validate proofOfPayment
  const isValidProofOfPayment = (proofOfPayment) => {
    // Check if proofOfPayment is null or undefined
    if (!proofOfPayment) {
      return false;
    }

    // Validate proofOfPayment
    if (!isValidProofOfPayment(proofOfPayment)) {
      toast.error("Please upload a valid bank receipt or teller.");
      return false;
    }

    // Add additional validation logic here
    // For example, check file type or size
    const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedFileTypes.includes(proofOfPayment.type)) {
      return false;
    }

    // Add more validation logic if needed

    return true;
  };

  return true;
};
