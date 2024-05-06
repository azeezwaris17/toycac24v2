import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import the slices
import {
  fetchAdmins,
  setAdminsData,
} from "../../../redux/super_admin/superAdminFetchAllAdmins";
import { approveAdmin } from "../../../redux/super_admin/superAdminApproveAdminAccount";

import toast from "react-hot-toast";
import { BsSearch, BsFilter, BsArrowLeft, BsArrowRight } from "react-icons/bs";
const RegisteredAdminsTable = ({ admins, openAdminDetailsModal }) => {
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
              Status
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
          {admins.map((admin, index) => (
            <tr
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {admin.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {admin.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {admin.approved ? (
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
                  onClick={() => openAdminDetailsModal(admin)}
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

const AdminDetailsModal = ({ admin, onClose, onApprove }) => {
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      {/* user details modal */}
      <div className="flex items-center justify-center min-h-screen px-2">
        <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full relative">
          {/* heading */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Admin Details</h2>
            <button onClick={onClose}>
              <span className="sr-only">Close modal</span>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* body */}
          <div className="px-4 py-6">
            <p>Full Name: {admin.fullName}</p>
            <p>Email: {admin.email}</p>
            <p>Status: {admin.approved ? "Approved" : "Pending"}</p>

            <div className="flex justify-end gap-4 mt-4">
              {admin.approved === false && (
                <button
                  onClick={onApprove}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Approve admin
                </button>
              )}
              {admin.approved === true && (
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

export default function RegisteredAdminsComponent() {
  // const users = useSelector((state) => state.adminApproveUserAccount.users);
  const admins = useSelector((state) => state.superAdminFetchAllAdmins.admins);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAdmin, setSelectedAdmin] = useState(null); // New state for selected user
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Dispatch getAdmins action
        const response = await dispatch(fetchAdmins());
        if (response.payload && Array.isArray(response.payload.admins)) {
          const registeredAdmins = response.payload.admins;
          dispatch(setAdminsData(registeredAdmins));
        } else {
          console.error("Invalid response format:", response.payload);
          setError("Invalid response format. Please try again.");
          toast.error("Invalid response format. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        setError("Failed to fetch admins. Please try again.");
        toast.error("Failed to fetch admins. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, filterStatus, dispatch]);

  const openAdminDetailsModal = (admin) => {
    setSelectedAdmin(admin); // Set the selected admin
  };

  const closeAdminDetailsModal = () => {
    setSelectedAdmin(null); // Reset selected admin when closing modal
  };

  // For approving a user

  const approveAdminInModal = async () => {
    if (selectedAdmin) {
      try {
        setLoading(true);
        // Dispatch approveUser action
        const approveAdminAction = await dispatch(
          approveAdmin(selectedAdmin._id)
        );
        if (approveAdminAction.payload) {
          const approvedAdmin = approveAdminAction.payload.admin;
          if (approvedAdmin && approvedAdmin.approved === true) {
            toast.success("User approved successfully");
            // Update the list of admins after approval
            const updatedAdmins = admins.map((admin) =>
              admin._id === approvedAdmin._id
                ? { ...admin, approved: true }
                : admin
            );
            dispatch(setAdminsData(updatedAdmins));
          } else {
            console.error(
              "Failed to approve admin: Unknown error",
              approveAdminAction.payload
            );
            setError("Failed to approve admin. Please try again.");
            toast.error("Failed to approve admin. Please try again.");
          }
        } else {
          console.error(
            "Failed to approve admin: Payload not found",
            approveAdminAction.error
          );
          setError("Failed to approve admin. Please try again.");
          toast.error("Failed to approve admin. Please try again.");
        }
      } catch (error) {
        console.error("Error approving user:", error);
        setError("Failed to approve user. Please try again.");
        toast.error("Failed to approve user. Please try again.");
      } finally {
        setLoading(false);
        setSelectedAdmin(null);
      }
    }
  };

  const filteredAdmins =
    admins && admins.length > 0
      ? admins.filter((admin) => {
          // Check if the admin object has all required properties
          if (
            admin &&
            admin.fullName &&
            admin.email &&
            admin.approved !== undefined // Check if 'approved' is defined
          ) {
            if (filterStatus === "all") {
              return (
                admin.fullName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                searchTerm.trim() === ""
              );
            } else {
              return (
                admin.fullName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) &&
                admin.approved.toString() === filterStatus // Changed 'user.status' to 'user.approved.toString()'
              );
            }
          }
          return false; // Filter out incomplete user objects
        })
      : [];

  const totalItems = filteredAdmins.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);

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
        Registered Admins
      </h1>

      <div className="flex flex-col lg:flex-row mt-4 mb-4">
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
      </div>

      {/* loading state */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="border border-t-4 border-gray-200 rounded-full h-16 w-16 animate-spin"></div>
        </div>
      )}
      {!loading && currentItems.length === 0 && (
        <div className="flex items-center justify-center">
          <p>No admins available</p>
        </div>
      )}
      {!loading && currentItems.length > 0 && (
        <>
          <RegisteredAdminsTable
            admins={currentItems}
            openAdminDetailsModal={openAdminDetailsModal}
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
          {selectedAdmin && (
            <AdminDetailsModal
              admin={selectedAdmin}
              onClose={closeAdminDetailsModal}
              onApprove={approveAdminInModal}
            />
          )}
        </>
      )}
    </>
  );
}
