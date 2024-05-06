import React, { useState } from "react";
import { List, Dropdown, Button, Modal } from "flowbite-react";
import { HiBell } from "react-icons/hi";
import Image from "next/image";

export default function Notification() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      link: "https://example.com/notification1",
      image: "notification1.jpg",
      alt: "Notification 1",
      bgColor: "green",
      svgPath: <path d="M12 6l-2 2-4-4" />,
      message: "You have a new message!",
      time: "2 minutes ago",
      checked: false,
    },
    {
      link: "https://example.com/notification2",
      image: "notification2.jpg",
      alt: "Notification 2",
      bgColor: "blue",
      svgPath: <path d="M12 6l-2 2-4-4" />,
      message: "A new event has been scheduled.",
      time: "1 hour ago",
      checked: false,
    },
  ]);
  const [newNotification, setNewNotification] = useState({
    link: "",
    image: "",
    alt: "",
    bgColor: "",
    svgPath: "",
    message: "",
    time: "",
    checked: false,
  });

  const handleBellClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle the dropdown when the bell button is clicked
  };

  const addNotification = () => {
    setNotifications([...notifications, newNotification]);
    setShowModal(false); // Close the modal after adding the new notification
    setNewNotification({
      link: "",
      image: "",
      alt: "",
      bgColor: "",
      svgPath: "",
      message: "",
      time: "",
      checked: false,
    }); // Reset the newNotification state
  };

  return (
    <div className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400">
      <Dropdown
        isOpen={isDropdownOpen}
        toggle={handleBellClick}
        renderTrigger={() => (
          // Render the trigger as the notification bell button
          <button
            id="dropdownNotificationButton"
            data-dropdown-toggle="dropdownNotification"
            type="button"
            onClick={handleBellClick}
          >
            <HiBell className="w-5 h-5" />
            {notifications.length > 0 && (
              <div className="absolute block w-5 h-5 bg-green-500 border border-white rounded-full -top-1 start-3 dark:border-gray-900">
                <span className="text-white">{notifications.length}</span>
              </div>
            )}
          </button>
        )}
      >
        <Dropdown.Menu className="absolute right-0">
          {notifications.map((notification, index) => (
            <Dropdown.Item key={index} icon={HiBell}>
              <a
                href={notification.link}
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex-shrink-0">
                  <Image
                    className="rounded-full w-11 h-11"
                    src={notification.image}
                    alt={notification.alt}
                    width={4}
                    height={4}
                  />
                  <div
                    className={`absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-${notification.bgColor}-600 border border-white rounded-full dark:border-gray-800`}
                  >
                    <svg
                      className="w-2 h-2 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      {notification.svgPath}
                    </svg>
                  </div>
                </div>
                <div className="w-full ps-3">
                  <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                    {notification.message}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">
                    {notification.time}
                  </div>
                </div>
              </a>
            </Dropdown.Item>
          ))}
          <Dropdown.Item>
            <Button onClick={() => setShowModal(true)}>Add Notification</Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Add New Notification</Modal.Header>
        <Modal.Body>
          {/* Text inputs for each notification property */}
          <input
            type="text"
            placeholder="Link"
            value={newNotification.link}
            onChange={(e) =>
              setNewNotification({ ...newNotification, link: e.target.value })
            }
          />
          {/* Add more text inputs for other notification properties */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addNotification}>Add Notification</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const NotificationItem = ({ notification }) => {
  return (
    <a
      href={notification.link}
      className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <div className="flex-shrink-0">
        <Image
          className="rounded-full w-11 h-11"
          src={notification.image}
          alt={notification.alt}
          width={4}
          height={4}
        />
        <div
          className={`absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-${notification.bgColor}-600 border border-white rounded-full dark:border-gray-800`}
        >
          <svg
            className="w-2 h-2 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 18"
          >
            {notification.svgPath}
          </svg>
        </div>
      </div>
      <div className="w-full ps-3">
        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
          {notification.message}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-500">
          {notification.time}
        </div>
      </div>
    </a>
  );
};
