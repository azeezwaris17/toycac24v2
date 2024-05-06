import { toast } from "react-hot-toast";

// Validate user input
export const validateSigninFormData = (data) => {
  const { username, password } = data;

  // Check if any required field is empty
  if (!username || !password) {
    toast.error("Please fill in all required fields.");
    return false; // Return false if any field is empty
  }

  return true;
};
