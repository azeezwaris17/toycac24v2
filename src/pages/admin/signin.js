import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  FiUser,
  FiLock,
  FiLoader,
  FiXCircle,
  FiSend,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { validateSigninFormData } from "../../utils/admin/signinFormValidation";
import { signinAdminAccount } from "../../redux/admin/adminSigninAuthSlice";
import { Modal } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function SigninUser() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState("");

  useEffect(() => {
    // Populate the username field with the uniqueID from query params
    const { uniqueID } = router.query;
    console.log(uniqueID);
    if (uniqueID) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        username: decodeURIComponent(uniqueID), // Decode the uniqueID
      }));
    }
  }, [router.query]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSigninFormData(formData)) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(signinAdminAccount(formData));

      // Check if signin was successful
      if (response.payload && response.payload.success) {
        router.push("/admin/dashboard"); // Navigate to the dashboard page
      } else {
        // Handle status code errors if present
        if (response.payload && response.payload.error) {
          const { status, data } = response.payload.error;
          console.log("Status:", status); // Log status here
          if (status === 404) {
            toast.error(
              data && data.message ? data.message : "Admin not found"
            );
            // setError(errorMessage);
          } else if (status === 403) {
            toast.error(
              data && data.message
                ? data.message
                : "Account is pending approval"
            );
          } else if (status === 401) {
            toast.error(
              data && data.message
                ? data.message
                : "Invalid username or password"
            );
          } else if (status === 500) {
            toast.error(
              data && data.message ? data.message : "Error signin in, try again"
            );
          }
        } else {
          // No error payload found
          toast.error("Failed to signin account.");
        }
      }
    } catch (error) {
      console.error("Account signin error:", error);
      toast.error("Failed to signin account.");
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-black"
      style={{ backgroundImage: `url(/toycac24BG.jpg)` }}
    >
      <div className="">
        <Toaster position="bottom-center" reverseOrder={false}></Toaster>
      </div>

      <div className="w-full flex flex-col items-center justify-center min-h-screen ">
        <div className="flex flex-row justify-center items-center gap-2 mb-4">
          <Image
            src="/timsan_logo.png"
            alt="timsan_logo"
            width={64}
            height={64}
          />
          <Image
            src="/OyoState_logo.png"
            alt="OyoState_logo"
            width={82}
            height={82}
          />
        </div>

        <h2 className="text-2xl text-[#647862] font-bold mt-4 mb-4">
          TOYCAC&apos;24 - Login your account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm p-4 bg-white rounded-xl"
        >
          {/* Form inputs */}
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <div className="flex items-center">
              <FiUser className="h-5 w-5 mr-2 text-[#DFBF76]" />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="flex items-center">
              <FiLock className="h-5 w-5 mr-2 text-[#DFBF76]" />
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="mb-2 flex items-center">
            <FiSend className="h-5 w-5 mr-2 text-[#DFBF76]" />
            <button
              type="submit"
              className="w-full bg-[#647862] text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center"
              disabled={loading} // Disable button when loading
            >
              {/* Conditional rendering based on loading state */}
              {loading ? (
                <FiLoader className="animate-spin mr-2" /> // Show loading spinner if loading
              ) : (
                "Signin" // Show button text if not loading
              )}
              {error ? (
                <FiXCircle className="text-red-500 ml-2" /> // Show error icon if there's an error
              ) : null}
            </button>
          </div>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-2">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/admin/create_account"
              className="font-medium text-[#DFBF76] hover:underline"
            >
              Signup
            </Link>
          </p>
        </form>

        <div className="mt-4">
          <p className="italic ">Igniting Hearts, Transcending Boundaries</p>
        </div>
      </div>

      {/* Error modal */}
      <Modal show={!!error} onClose={() => setError("")} title="Error">
        <div className="flex flex-col items-center">{error}</div>
      </Modal>
    </div>
  );
}
