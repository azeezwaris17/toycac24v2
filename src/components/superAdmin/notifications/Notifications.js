import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, sendNotification } from "../../../redux/super_admin/notifications";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { Alert } from "flowbite-react";

const Notifications = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(true); // Display modal by default
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.superAdminNotifications.notifications);
  const dropdownRef = useRef(null);
  const recipientDropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    setShowDropdown(false);
  };

  const handleSendMessage = async () => {
    try {
      setShowRecipientDropdown(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecipientSelect = (selectedRecipient) => {
    if (selectedRecipient === "allAdmins" || selectedRecipient === "allUsers") {
      setRecipient(selectedRecipient);
      setConfirmSend(true);
    } else {
      setRecipient(selectedRecipient);
    }
    setShowRecipientDropdown(false);
  };

  const handleSendMessageToRecipient = async () => {
    try {
      await dispatch(sendNotification({ recipient, message }));
      setShowModal(false);
      setRecipient("");
      setMessage("");
      setConfirmSend(false);
      dispatch(fetchNotifications());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button className="bg-gray-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center" onClick={toggleDropdown}>
        {notifications && notifications.length > 0 && (
          <span className="bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-xs absolute top-0 right-0 -mt-1 -mr-1">{notifications.length}</span>
        )}
        <IoNotificationsOutline size={24} />
      </button>
      {showDropdown && (
        <div ref={dropdownRef} className="absolute right-0 mt-4 w-64 z-20 bg-white shadow-lg rounded-lg">
          <div className="p-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id} className="bg-gray-100 p-2 rounded-lg mb-2">
                  <p>{notification.sender}</p>
                  <p>{notification.message}</p>
                </div>
              ))
            ) : (
              <p>You have no notifications, please check back later.</p>
            )}
            <button
              onClick={toggleModal}
              className="flex items-center justify-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#647862] hover:bg-[#647862]"
            >
              <AiOutlinePlus className="mr-2" />
              Send Message
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <div className="z-20 fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg" ref={recipientDropdownRef}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="p-2 w-full h-32 border-gray-300 rounded-md shadow-sm focus:ring-[#647862] focus:border-[#647862] sm:text-sm"
            ></textarea>
            <button
              onClick={handleSendMessage}
              className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-[#647862]"
            >
              Send
            </button>
            {showRecipientDropdown && (
              <div className="mt-2">
                <button onClick={() => handleRecipientSelect("allAdmins")} className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  All Admins
                </button>
                <button onClick={() => handleRecipientSelect("allUsers")} className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  All Users
                </button>
              </div>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Alert */}
      {confirmSend && (
        <Alert color="warning" rounded className="z-40 fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <span className="font-medium">Are you sure you want to send the message to all {recipient === "allAdmins" ? "admins" : "users"}?</span>
            <div className="mt-4">
              <button
                onClick={() => {
                  handleSendMessageToRecipient();
                  setConfirmSend(false);
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                OK
              </button>
              <button
                onClick={() => setConfirmSend(false)}
                className="ml-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default Notifications;
