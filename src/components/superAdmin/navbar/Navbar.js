import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
// import Notification from "../notification/Notification";

export default function Navbar({ onNavigate, username }) {
  const [activeButton, setActiveButton] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveButton(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHamburgerClick = (buttonName) => {
    setActiveButton(activeButton === buttonName ? null : buttonName);
  };

  return (
    <nav className="relative max-w-screen-xl flex items-center justify-between mx-3 sm:mx-auto py-3 px-4 md:px-6 my-3 rounded-md border border-[#DFBF76]">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="hidden md:flex items-center">
          <Image
            src="/timsan_logo.png"
            alt="Timnsan Logo"
            width={32}
            height={32}
          />
          <Image
            src="/OyoState_logo.png"
            alt="OyoState_logo"
            width={42}
            height={42}
          />
        </div>
        <span className="text-xl font-semibold whitespace-nowrap">
          TOYCAC&apos;24
        </span>
      </div>

      {/* Notification component */}
      {/* <Notification /> */}

      {/* Hamburger menu button */}
      <div className="block lg:hidden">
        <button
          className="text-gray-800 focus:outline-none"
          onClick={() => handleHamburgerClick("menu")}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Nav items */}
      {activeButton === "menu" && (
        <div
          ref={menuRef}
          className="absolute top-8 z-40 px-4 right-0 rounded-md py-8 w-full mt-4 md:hidden bg-white"
        >
          <hr />
          <p>Hi! {username}</p>

          <ul className="flex flex-col font-medium">
            <li>
              <button
                className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                onClick={() => {
                  onNavigate("dashboard");
                  setActiveButton(null);
                }}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                onClick={() => {
                  onNavigate("registeredUsers");
                  setActiveButton(null);
                }}
              >
                Registered Users
              </button>
            </li>

            <li>
              <button
                className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                onClick={() => {
                  onNavigate("registeredAdmins");
                  setActiveButton(null);
                }}
              >
                Registered Admins
              </button>
            </li>

            <hr />

            <li>
              <button
                className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                onClick={() => {
                  onNavigate("signout");
                  setActiveButton(null);
                }}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
