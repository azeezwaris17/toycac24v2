import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  verifyEmail,
} from "../../redux/user/userResetPassword";
import {
  FiMail,
  FiLoader,
  FiSend,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FaArrowRightLong, FaArrowDown } from "react-icons/fa6";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

import toast, { Toaster } from "react-hot-toast";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailChecked, setEmailChecked] = useState(false); // Track email check status
  const [email, setEmail] = useState(""); // Store the email for password reset
  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState(false); // State to track error state

  const handlePasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  // verify email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;

    try {
      setLoading(true);

      await dispatch(verifyEmail({ email })).unwrap();
      setEmail(email); // Store the email for password reset
      setEmailChecked(true); // Set email check status to true
      toast.success("Email found.");
      setLoading(false);
    } catch (error) {
      handleServerRequest_ResponseError(error);
    }
  };

  // reset password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await dispatch(resetPassword({ email, newPassword })).unwrap();
      toast.success("Password reset successfully. Please sign in.");
      router.push("/signin");
    } catch (error) {
      handleServerRequest_ResponseError(error);
    }
  };

  // Handling request-response error
  const handleServerRequest_ResponseError = (error) => {
    setLoading(false);
    setError(true);

    if (error.response) {
      // Server response Error (error.response)
      console.error("Error response:", error.response.data);
      const message =
        error.response.data?.message || "Email not found";
      toast.error(message);
    } else if (error.request) {
      // Network Error (error.request)
      console.error("Error request:", error.request);
      toast.error(
        "Trouble connecting to the server. Please check your internet connection and try again later."
      );
    } else if (error.message) {
      // Other Errors (error.message)
      const message =
      error.data?.message || "Email not found";
      console.error("Error message:", message);
    toast.error(message);
     
    } else {
      // Unknown Error
      console.error("Unknown error:", error);
      toast.error("An unknown error occurred. Please try again.");
    }

    setTimeout(() => {
      setError(false);
    }, 2000); // Reset error state after 2 seconds
  };

  return (
    <>
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
          TOYCAC&apos;24 - Reset your password
        </h2>
        
          {!emailChecked ? (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div className="mb-4 relative">
                <label htmlFor="email" className="sr-only text-[#EAF0F7]">
                  Email
                </label>
                <div className="w-full flex items-center bg-[#EAF0F7] rounded-lg border border-gray-300">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                  />
                  <FiMail className="absolute right-3 h-4 w-4 text-gray-900" />
                </div>
              </div>
              <div className="mb-4 relative">
                <div className="flex items-center bg-[#EAF0F7] rounded-lg border border-gray-300">
                  {/* Fine email  Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#647862] text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin h-5 w-5 mr-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2 h-5 w-5" />
                        Find Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Reset Password
              </h2>
              <div className="mb-4 relative">
                <label htmlFor="email" className="sr-only text-[#EAF0F7]">
                  Email
                </label>
                <div className="flex items-center bg-[#EAF0F7] rounded-lg border border-gray-300">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                  />
                  <FiMail className="absolute right-3 h-4 w-4 text-gray-900" />
                </div>
              </div>
              <div className="mb-4 relative">
                <label htmlFor="newPassword" className="sr-only text-[#EAF0F7]">
                  New Password
                </label>
                <div className="flex items-center bg-[#EAF0F7] rounded-lg border border-gray-300">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordToggle}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4 text-gray-900" />
                    ) : (
                      <FiEye className="h-4 w-4 text-gray-900" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="confirmPassword"
                  className="sr-only text-[#EAF0F7]"
                >
                  Confirm Password
                </label>
                <div className="flex items-center bg-[#EAF0F7] rounded-lg border border-gray-300">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordToggle}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4 text-gray-900" />
                    ) : (
                      <FiEye className="h-4 w-4 text-gray-900" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mb-4 relative">
                <div className="flex items-center bg-[#EAF0F7] rounded-lg border border-gray-300">
                  {/* Reset password  Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#647862] text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin h-5 w-5 mr-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2 h-5 w-5" />
                        Reset password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
