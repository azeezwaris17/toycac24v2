import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import the slices
import {
  fetchUsers,
  setUsersData,
} from "../../../redux/super_admin/superAdminFetchAllUsers";
import { approveUser } from "../../../redux/super_admin/superAdminApproveUserAccount";

import toast from "react-hot-toast";
import { BsSearch, BsFilter, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AiOutlineDownload } from "react-icons/ai";
import { LiaSpinnerSolid } from "react-icons/lia";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import Image from "next/image";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";
import Link from "next/link";

export const config = {
  runtime: "experimental-edge",
};

const RegisteredUsersTable = ({ users, openUserDetailsModal }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Full Name
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Username
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Reg. Status
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {user.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {user.email}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {user.uniqueID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.approved ? (
                  <span className="bg-green-100 text-green-800 rounded-full px-2">
                    Approved
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 rounded-full px-2">
                    Pending
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => openUserDetailsModal(user)}
                  className="text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserDetailsModal = ({ user, onClose, onApprove }) => {
  const [showProofOfPayment, setShowProofOfPayment] = useState(false);
  const [proofOfPaymentDisplayed, setProofOfPaymentDisplayed] = useState(false);

  // Constructing the URL for the proof of payment image
  // const proof_of_payment = user.proofOfPayment;

  // console.log(proof_of_payment);

  const handleProofOfPaymentClick = () => {
    setShowProofOfPayment(!showProofOfPayment);
    if (!showProofOfPayment) {
      setProofOfPaymentDisplayed(true);
    }
  };

  const buttonText = proofOfPaymentDisplayed ? "Hide" : "View";

  const handleHideProofOfPayment = () => {
    setShowProofOfPayment(false);
    setProofOfPaymentDisplayed(false);
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      {/* user details modal */}
      <div className="flex items-center justify-center min-h-screen px-2">
        <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full relative">
          {/* heading */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">User Details</h2>
            <button onClick={onClose}>
              <span className="sr-only">Close modal</span>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* body */}
          <div className="px-4 py-6">
            <p>Full Name: {user.fullName}</p>
            <p>Email: {user.email}</p>
            <p>Username: {user.uniqueID}</p>
            <p>Phone number: {user.phoneNumber}</p>
            <p>Category: {user.category}</p>
            <p>Institution: {user.institution}</p>
            <p>Medical condition: {user.medicalCondition}</p>
            <p>Registration Status: {user.approved ? "Approved" : "Pending"}</p>
            <div className="flex flex-row items-center gap-2">
              Proof of Payment:{" "}
              <a
                href={user.proofOfPayment}
                target="_blank"
                className="text-[12px] md:text-md"
              >
                {user.proofOfPayment}
              </a>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              {user.approved === false && (
                <button
                  onClick={onApprove}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Approve user
                </button>
              )}
              {user.approved === true && (
                <button
                  className="font-medium text-gray-500 cursor-not-allowed"
                  disabled
                >
                  Approved
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RegisteredUsersComponent() {
  // const users = useSelector((state) => state.adminApproveUserAccount.users);
  const users = useSelector((state) => state.superAdminFetchAllUsers.users);

  const dispatch = useDispatch();

  // State variables for download format and data
  const [downloadFormat, setDownloadFormat] = useState(null);
  const [downloadData, setDownloadData] = useState([]);

  // Function to generate data for download
  const generateDownloadData = useCallback(() => {
    // Transform 'users' data into the desired format for download
    const formattedData = users.map((user) => ({
      FullName: user.fullName,
      Category: user.category,
      RegistrationStatus: user.approved ? "Approved" : "Pending",
    }));

    return formattedData;
  }, [users]);

  // Function to handle download button click
  const handleDownload = useCallback(async () => {
    setLoading(true); // Set loading state when download starts

    try {
      const data = generateDownloadData();

      if (downloadFormat === "excel") {
        // Generate Excel file
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Users");

        // Add headers
        const headers = Object.keys(data[0]);
        sheet.addRow(headers);

        // Add data to the worksheet
        data.forEach((row) => {
          sheet.addRow(Object.values(row));
        });

        // Save the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "TOYCAC'24 Registered Campers.xlsx");
      } else if (downloadFormat === "google_sheets") {
        // Generate Google Sheets file
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, "TOYCAC'24 Registered Campers.xlsx");
      }

      // Set success icon after successful download
      setDownloadData(data);

      // Reset icon and select option after 2 seconds
      setTimeout(() => {
        setDownloadData([]);
        setDownloadFormat("");
      }, 2000);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Handle error
    } finally {
      setLoading(false); // Clear loading state when download completes
    }
  }, [downloadFormat, generateDownloadData]);

  useEffect(() => {
    if (downloadFormat) {
      handleDownload();
    }
  }, [downloadFormat, handleDownload]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null); // New state for selected user
  const itemsPerPage = 10;

  // fetch users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Dispatch getUsers action
        const response = await dispatch(fetchUsers());
        if (response.payload && Array.isArray(response.payload)) {
          const registeredUsers = response.payload;
          dispatch(setUsersData(registeredUsers));
        } else {
          console.error("Invalid response format:", response.payload);
          setError("Failed to fetch users. Please try again.");
          toast.error("Failed to fetch users. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again.");
        toast.error("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, filterStatus, dispatch]);

  const openUserDetailsModal = (user) => {
    setSelectedUser(user); // Set the selected user
  };

  const closeUserDetailsModal = () => {
    setSelectedUser(null); // Reset selected user when closing modal
  };

  // For approving a user
  const approveUserInModal = async () => {
    if (selectedUser) {
      try {
        setLoading(true);
        // Dispatch approveUser action
        const approveUserAction = await dispatch(approveUser(selectedUser._id));
        if (approveUserAction.payload) {
          const approvedUser = approveUserAction.payload.user;
          if (approvedUser && approvedUser.approved === true) {
            toast.success("User approved successfully");
            // Update the list of admins after approval
            const updatedUsers = users.map((user) =>
              user._id === approvedUser._id ? { ...user, approved: true } : user
            );

            dispatch(setUsersData(updatedUsers));
          } else {
            console.error(
              "Failed to approve user: Unknown error",
              approveUserAction.payload
            );
            setError("Failed to approve user. Please try again.");
            toast.error("Failed to approve user. Please try again.");
          }
        } else {
          console.error(
            "Failed to approve user: Payload not found",
            approveUserAction.error
          );
          setError("Failed to approve user. Please try again.");
          toast.error("Failed to approve user. Please try again.");
        }
      } catch (error) {
        console.error("Error approving user:", error);
        setError("Failed to approve user. Please try again.");
        toast.error("Failed to approve user. Please try again.");
      } finally {
        setLoading(false);
        setSelectedUser(null);
      }
    }
  };

  const filteredUsers =
    users && users.length > 0
      ? users.filter((user) => {
          // Check if the user object has all required properties
          if (
            user &&
            user.fullName &&
            user.category &&
            user.approved !== undefined // Check if 'approved' is defined
          ) {
            if (filterStatus === "all") {
              return (
                user.fullName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                searchTerm.trim() === ""
              );
            } else {
              return (
                user.fullName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) &&
                user.approved.toString() === filterStatus // Changed 'user.status' to 'user.approved.toString()'
              );
            }
          }
          return false; // Filter out incomplete user objects
        })
      : [];

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <h1 className="text-gray-800 text-2xl font-medium font-inter leading-6">
        Registered users
      </h1>

      <div className="flex flex-col lg:flex-row mt-4 mb-4">
        {/* search system */}
        <div className="relative flex items-start lg:items-center">
          <input
            type="text"
            placeholder="Search by Full Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* filter and download system */}
        <div className="flex flex-row gap-2">
          {/* filter system */}
          <div className="relative mt-3 lg:mt-0 lg:ml-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <option value="all">All</option>
              <option value="false">Pending</option>{" "}
              {/* Changed 'pending' to 'false' */}
              <option value="true">Approved</option>{" "}
              {/* Changed 'approved' to 'true' */}
            </select>
            <BsFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Download button and format selection */}
          <div className="relative mt-3 lg:mt-0 lg:ml-4">
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <option value="">Select Format</option>
              <option value="excel">Excel</option>
              <option value="google_sheets">Google Sheets</option>
            </select>

            <button
              disabled={!downloadFormat}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {loading ? (
                <LiaSpinnerSolid className="animate-spin" /> // Render loading spinner while downloading
              ) : downloadData.length > 0 ? (
                <MdOutlineFileDownloadDone /> // Render success icon after successful download
              ) : (
                <AiOutlineDownload /> // Default download icon
              )}
            </button>
          </div>
        </div>
      </div>

      {/* loading state */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="border border-t-4 border-gray-200 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {!loading && currentItems.length === 0 && (
        <div className="flex items-center justify-center">
          <p>No users available</p>
        </div>
      )}
      {!loading && currentItems.length > 0 && (
        <>
          <RegisteredUsersTable
            users={currentItems}
            openUserDetailsModal={openUserDetailsModal}
          />

          <div className="flex justify-between mt-4">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="text-sm text-gray-600 font-medium focus:outline-none"
            >
              <BsArrowLeft className="inline-block mr-1" />
              Prev
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="text-sm text-gray-600 font-medium focus:outline-none"
            >
              Next
              <BsArrowRight className="inline-block ml-1" />
            </button>
          </div>

          {/* Render UserDetailsModal if selectedUser is not null */}
          {selectedUser && (
            <UserDetailsModal
              user={selectedUser}
              onClose={closeUserDetailsModal}
              onApprove={approveUserInModal}
            />
          )}
        </>
      )}
    </>
  );
}
