import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiLoader,
  FiSend,
  FiXCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { validateFormData } from "../../utils/superAdmin/registrationFormValidation";
import { createSuperAdminAccount } from "../../redux/super_admin/superAdminRegistrationAuthSlice";
import { Modal } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function RegisterUser() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [superAdminRegisteredData, setSuperAdminRegisteredData] = useState({
    fullName: "",
    uniqueID: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData(formData)) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    let superAdminUniqueID = ""; // Define uniqueID outside the try block
    try {
      setLoading(true);
      const response = await dispatch(createSuperAdminAccount(formData));
      console.log("Response:", response);
      // Check if account creation was successful
      if (
        response.payload &&
        response.payload.message === "SuperAdmin created successfully"
      ) {
        setLoading(false);
        superAdminUniqueID = response.payload.uniqueID;
        const { fullName, uniqueID } = response.payload;
        setSuperAdminRegisteredData({ fullName, uniqueID });
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push(
            `/super_admin/signin?uniqueID=${encodeURIComponent(
              superAdminUniqueID
            )}`
          );
        }, 10000);
      } else {
        // Handle status code errors if present
        if (response.payload && response.payload.error) {
          const { status, data } = response.payload.error;
          console.log("Status:", status); // Log status here
          if (status === 500) {
            toast.error(
              data && data.message ? data.message : "Server Error! Try again."
            );
          } else {
            // No error payload found
            toast.error("Failed to create account.");
          }
        }
      }
    } catch (error) {
      console.error("Account creation error:", error);
      toast.error("Failed to create super admin account.");
      setError("Failed to create super admin account.");
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
          TOYCAC&apos;24 - Camp Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm p-4 bg-white rounded-xl"
        >
          {/* Form inputs */}
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="sr-only">
              Full Name
            </label>
            <div className="flex items-center">
              <FiUser className="h-5 w-5 mr-2 text-[#DFBF76]" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="flex items-center">
              <FiMail className="h-5 w-5 mr-2 text-[#DFBF76]" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="sr-only">
              Phone Number
            </label>
            <div className="flex items-center">
              <FiPhone className="h-5 w-5 mr-2 text-[#DFBF76]" />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
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
          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <div className="flex items-center">
              <FiLock className="h-5 w-5 mr-2 text-[#DFBF76]" />
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
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
                "Create" // Show button text if not loading
              )}
              {error ? (
                <FiXCircle className="text-red-500 ml-2" /> // Show error icon if there's an error
              ) : null}
            </button>
          </div>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-2">
            Already have an account?{" "}
            <Link
              href="/super_admin/signin"
              className="font-medium text-[#DFBF76] hover:underline"
            >
              Signin
            </Link>
          </p>
        </form>

        <div className="mt-4">
          <p className="italic ">Igniting Hearts, Transcending Boundaries</p>
        </div>
      </div>

      {/* Success modal */}
      <Modal
        // dismissible
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
      >
        <Modal.Header>
          {" "}
          Congratulations {superAdminRegisteredData.fullName},
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              your account has been created successfully.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Proceed to signin with your unique ID:{" "}
              {superAdminRegisteredData.uniqueID} as your username and your
              registered password as password.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            ...
          </p>
        </Modal.Footer>
      </Modal>

      <Modal
        show={!!error}
        onClose={() => setError("")}
        title="Error"
        popup
        dismissible
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {error}
            </h3>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Modal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
      >
        <div className="flex flex-col items-center">
          <p>
            Congratulations {userRegisteredData.fullName}, your account has been
            created successfully.
          </p>
          <p>
            Proceed to signin with your unique ID: {userRegisteredData.uniqueID}{" "}
            as your username and your registered password as password.
          </p>
          <p>Proceeding you to signin...</p>
        </div>
      </Modal> */}

      {/* Error modal */}
      {/* <Modal show={!!error} onClose={() => setError("")} title="Error">
        <div className="flex flex-col items-center">{error}</div>
      </Modal> */}
    </div>
  );
}
