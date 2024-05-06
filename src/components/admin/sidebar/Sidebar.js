import React from "react";
import { MdApps, MdExitToApp } from "react-icons/md";
import { TiUser } from "react-icons/ti";

export default function Sidebar({ onNavigate, activeComponent }) {
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

  return (
    <aside
      className="hidden lg:block fixed w-64 max-h-screen-[calc(100vh-88px)] p-4 z-10 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 outline outline-offset-2 outline-3 outline-[#647862]"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      {/* <div className="w-full pt-8 pb-20 px-3 h-full bg-white dark:bg-gray-800"> */}
      <ul className="space-y-6">
        {menuItem(
          "Dashboard",
          <MdApps className="w-6 h-6 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76]" />,
          () => onNavigate("dashboard"),
          activeComponent === "dashboard"
        )}
        {menuItem(
          "Registered users",
          <TiUser className="w-6 h-6 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76]" />,
          () => onNavigate("registeredUsers"),
          activeComponent === "registeredUsers"
        )}
      </ul>

      <hr />
      <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
        {menuItem(
          "Signout",
          <MdExitToApp className="w-6 h-6 text-gray-800 dark:text-white" />,
          () => onNavigate("signout"),
          activeComponent === "signout"
        )}
      </ul>
      {/* </div> */}
    </aside>
  );
}
