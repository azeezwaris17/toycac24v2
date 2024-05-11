import React from "react";
import { useRouter } from "next/router";
import { MdApps, MdExitToApp } from "react-icons/md";

export default function Sidebar({ onNavigate, activeComponent }) {
  const router = useRouter();

  const menuItem = (label, icon, onClick, isActive) => (
    <li>
      <button
        type="button"
        onClick={() => onClick && onClick(label.toLowerCase())}
        className={`flex items-center p-2 text-base font-medium text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] hover:bg-gray-100 rounded-lg group ${
          isActive ? "active" : ""
        }`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    </li>
  );

  // Function to handle signout
  const handleSignout = () => {
    router.push("/user/signin"); // Route to user/signin page
  };

  return (
    <aside
      className="hidden lg:block fixed w-64 max-h-screen-[calc(100vh-88px)] p-4 z-10 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 outline outline-offset-2 outline-3 outline-[#647862]"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <ul className="space-y-6">
        {menuItem(
          "Camp Rules",
          <MdApps className="w-6 h-6 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76]" />,
          () => onNavigate("camp_rules"),
          activeComponent === "camp_rules"
        )}
        {/* {menuItem(
          "Registered users",
          <TiUser className="w-6 h-6 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76]" />,
          () => onNavigate("registeredUsers"),
          activeComponent === "registeredUsers"
        )} */}

      </ul>

      <hr />

      <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
        {menuItem(
          "Signout",
          <MdExitToApp className="w-6 h-6 text-gray-800 dark:text-white" />,
          handleSignout, 
          
        )}
      </ul>
    </aside>
  );
}
