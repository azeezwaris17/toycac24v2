import { toast } from "react-hot-toast";

// Validate user input
export const validateFormData = (data) => {
  const { fullName, email, phoneNumber, password, confirmPassword } = data;

  // Check if any required field is empty
  if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
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

  return true;
};
