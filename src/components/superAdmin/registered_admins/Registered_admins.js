import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import the slices
import {
  fetchAdmins,
  setAdminsData,
} from "../../../redux/super_admin/superAdminFetchAllAdmins";

import {
  fetchRoles,
  setRoleData,
} from "../../../redux/super_admin/superAdminFetchAllRoles";

import {
  assignRole
} from "../../../redux/super_admin/superAdminAssignRole";

import {
  revokeRole
} from "../../../redux/super_admin/superAdminRevokeRole";

import { approveAdmin } from "../../../redux/super_admin/superAdminApproveAdminAccount";

import toast from "react-hot-toast";
import { BsSearch, BsFilter, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AiOutlineDownload } from "react-icons/ai";
import { LiaSpinnerSolid } from "react-icons/lia";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";

import { Dropdown, Alert} from "flowbite-react";


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
              Username
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
              Role
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
                {admin.uniqueID}
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {admin.role}
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

const AdminDetailsModal = ({
  admin,
  onClose,
  onApprove,
}) => {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.superAdminFetchAllRoles.roles);
  const [selectedRole, setSelectedRole] = useState(admin.role);
  const [loading, setLoading] = useState(false);
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [error, setError] = useState(null); // State for error message

  // fetch roles
  useEffect(() => {
    const fetchRolesData = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchRoles());
        // console.log (response)
        if (response.payload && Array.isArray(response.payload.roles)) {
          const availableRoles = response.payload.roles;
          // console.log(availableRoles)
          dispatch(setRoleData(availableRoles));
        } else {
          toast.error("Failed to fetch roles. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRolesData();
  }, [dispatch]);

  const handleAssignRole = () => {
    // Show confirmation alert before assigning role
    setShowConfirmationAlert(true);
  };

  const confirmAssignRole = () => {
    // Dispatch assignRole action with adminId and roleId
    dispatch(assignRole({ adminId: admin._id, roleId: selectedRole }))
      .then((success) => {
        // If role assignment is successful, show success alert
        if (success) {
          setShowSuccessAlert(true);
          
          // Fetch the updated admin data and update the Redux store
          dispatch(fetchAdmins()).then((response) => {
            if (response.payload && Array.isArray(response.payload.admins)) {
              const updatedAdmins = response.payload.admins;
              dispatch(setAdminsData(updatedAdmins));
            } else {
              console.error("Server error:", response.payload);
              setError("Failed to fetch admins. Please try again.");
              toast.error("Failed to fetch admins. Please try again.");
            }
          });
        } else {
          // If there's an error, set the error state
          setError("Error assigning role. Please try again.");
          toast.error("Error assigning role. Please try again.");
        }
      })
      .catch((error) => {
        // If there's an error, set the error state and log the error
        setError("Error assigning role. Please try again.");
        console.error("Error assigning role:", error);
      });
  
    // Close the confirmation alert
    setShowConfirmationAlert(false);
  };

  // Function to handle revoking role
  const handleRevokeRole = () => {
    if (admin) {
      // Dispatch revokeRole action with adminId
      dispatch(revokeRole(admin._id))
        .then((success) => {
           // If role revoking is successful, show success alert
           if (success) {
            setShowSuccessAlert(true); // Show success alert on successful revocation

            // Fetch the updated admin data and update the Redux store
            dispatch(fetchAdmins()).then((response) => {
              if (response.payload && Array.isArray(response.payload.admins)) {
                const updatedAdmins = response.payload.admins;
                dispatch(setAdminsData(updatedAdmins));
              } else {
                console.error("Server error:", response.payload);
                setError("Failed to fetch admins. Please try again.");
              }
            });
          } else {
            // If there's an error, set the error state
            setError("Error revoking role. Please try again.");
            toast.error("Error revoking role. Please try again.");
          }
        })
        .catch((error) => {
          setError("Error revoking role. Please try again.");
          console.error("Error revoking role:", error);
        });
    }
  };

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
            <div className="flex flex-col gap-3">
              <p>Full Name: {admin.fullName}</p>
              <p>Email: {admin.email}</p>
              <p>Status: {admin.approved ? "Approved" : "Pending"}</p>
              <p>Role: {admin.role}</p>
              <div>
                <Dropdown label="Assign Role" size="sm" placement="buttom" inline>
                  {Array.isArray(roles) &&
                    roles.map((role) => (
                      <Dropdown.Item
                        key={role}
                        onClick={() => {
                          setSelectedRole(role); // Set selectedRole immediately
                          handleAssignRole(); // Assign role immediately
                        }}
                        className={role === "admin" ? "text-blue-500" : (admin && admin.role && admin.role.includes(role) ? "text-green-500" : "text-black")} // Check if role is primary or secondary assigned to admin
                      >
                        {role}
                        {admin && admin.role && admin.role.includes(role) && ( // Render remove icon only for assigned roles
                          <IoPersonRemoveOutline
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent dropdown from closing
                              handleRevokeRole(role); // Handle revoking role
                            }}
                            className="text-red-500 ml-2 cursor-pointer"
                          />
                        )}
                      </Dropdown.Item>
                    ))}
                </Dropdown>
              </div>
              {/* Confirmation alert */}
              {showConfirmationAlert && (
                <Alert color="warning" withBorderAccent onDismiss={() => setShowConfirmationAlert(false)}>
                  <div className="flex flex-row gap-2 items-center justify-start">
                    <span className="font-medium">Are You sure you want to assign the role of &quot;{selectedRole}&quot; to &quot;{admin.fullName}&quot;?</span>
                    <button onClick={confirmAssignRole} className="text-green-500 font-medium mr-4">OK</button>
                  </div>
                </Alert>
              )}

              {/* Error alert */}
              {error && (
                <Alert color="danger" onDismiss={() => setError(null)}>
                  <span className="font-medium">{error}</span>
                </Alert>
              )}

              {/* Success alert */}
              {showSuccessAlert && (
                <Alert color="success" onDismiss={() => setShowSuccessAlert(false)}>
                  <span className="font-medium">Role &quot;{selectedRole}&quot; successfully assigned to &quot;{admin.fullName}&quot;</span>
                </Alert>
              )}
            </div>
          </div>

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

  // State variables for download format and data
  const [downloadFormat, setDownloadFormat] = useState(null);
  const [downloadData, setDownloadData] = useState([]);

  // Function to generate data for download
  const generateDownloadData = useCallback(() => {
    // Transform 'users' data into the desired format for download
    const formattedData = admins.map((admin) => ({
      FullName: admin.fullName,
      Email: admin.email,
      Status: admin.approved ? "Approved" : "Pending",
    }));

    return formattedData;
  }, [admins]);

  // Function to handle download button click
  const handleDownload = useCallback(async () => {
    setLoading(true); // Set loading state when download starts

    try {
      const data = generateDownloadData();

      if (downloadFormat === "excel") {
        // Generate Excel file
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Admins");

        // Add headers
        const headers = Object.keys(data[0]);
        sheet.addRow(headers);

        // Add data to the worksheet
        data.forEach((row) => {
          sheet.addRow(Object.values(row));
        });

        // Save the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "TOYCAC'24 Registered Admins.xlsx");
      } else if (downloadFormat === "google_sheets") {
        // Generate Google Sheets file
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Admins");
        XLSX.writeFile(wb, "TOYCAC'24 Registered Admins.xlsx");
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
  const [selectedAdmin, setSelectedAdmin] = useState(null); // New state for selected user
  const itemsPerPage = 10;

  // fetch admins
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
          console.error("Server error:", response.payload);
          setError("Failed to fetch admins. Please try again.");
          toast.error("Failed to fetch admins. Please try again.");
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

  // For approving a admin
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

  // const assignRoleToAdmin = async (adminId, role) => {
  //   if (selectedAdmin) {
  //     try {
  //       setLoading(true);
  //       // Dispatch approveUser action
  //       const assignRoleAction = await dispatch(assignRole(adminId, role));
  //       if (assignRoleAction.payload) {
  //         const adminAssignedRole = assignRoleAction.payload.admin;
  //         if (adminAssignedRole) {
  //           toast.success("Role assigned successfully");

  //           // Update the list of admins after approval
  //           const updatedAdminRole = admins.map((admin) =>
  //             admin._id === adminAssignedRole._id
  //               ? { ...admin, role: adminAssignedRole }
  //               : admin
  //           );
  //           dispatch(setRoleData(updatedAdminRole));
  //         } else {
  //           console.error(
  //             "Failed to assign role: Unknown error",
  //             assignRoleAction.payload
  //           );
  //           setError("Failed to assign role to admin. Please try again.");
  //           toast.error("Failed to assign role to admin. Please try again.");
  //         }
  //       } else {
  //         console.error(
  //           "Failed to assign role to admin: Payload not found",
  //           assignRoleAction.error
  //         );
  //         setError("Failed to assign role to admin. Please try again.");
  //         toast.error("Failed to assign role to admin. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Error assigning role to admin:", error);
  //       setError("Failed to assigning role to admin. Please try again.");
  //       toast.error("Failed to assigning role to admin. Please try again.");
  //     } finally {
  //       setLoading(false);
  //       setSelectedAdmin(null);
  //     }
  //   }
  // };

  // const revokeRoleFromAdmin = async (adminId) => {
  //   if (selectedAdmin) {
  //     try {
  //       setLoading(true);
  //       // Dispatch revoke role action
  //       const revokeRoleAction = await dispatch(revokeRole(adminId));
  //       if (revokeRoleAction.payload) {
  //         const adminRevokedRole = revokeRoleAction.payload.admin;
  //         if (adminRevokedRole) {
  //           toast.success("Role revoked successfully");

  //           const updatedAdminRole = admins.map((admin) =>
  //             admin._id === adminRevokedRole._id
  //               ? { ...admin, role: adminAssignedRole }
  //               : admin
  //           );
  //           dispatch(setRoleData(updatedAdminRole));
  //         } else {
  //           console.error(
  //             "Failed to revoke role: Unknown error",
  //             revokeRoleAction.payload
  //           );
  //           setError("Failed to revoke role from admin. Please try again.");
  //           toast.error("Failed to revoke role from admin. Please try again.");
  //         }
  //       } else {
  //         console.error(
  //           "Failed to revoke role to admin: Payload not found",
  //           revokeRoleAction.error
  //         );
  //         setError("Failed to revoke role from admin. Please try again.");
  //         toast.error("Failed to revoke role from admin. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Error revoking role:", error);
  //       setError("Failed to revoking role from admin. Please try again.");
  //       toast.error("Failed to revoking role from admin. Please try again.");
  //     } finally {
  //       setLoading(false);
  //       setSelectedAdmin(null);
  //     }
  //   }
  // };

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

          {/* Download file system */}
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
