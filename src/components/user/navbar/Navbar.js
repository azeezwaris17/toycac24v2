// src/components/user/navbar/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { MdMenu, MdChat } from "react-icons/md";

export default function Navbar({ onNavigate, username, fullName }) {
  const [activeButton, setActiveButton] = useState(null);
  const [liveChatMenuOpen, setLiveChatMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveButton(null);
        setLiveChatMenuOpen(false);
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

  const handleLiveChatClick = () => {
    setLiveChatMenuOpen(!liveChatMenuOpen);
  };

  const handleSignOut = () => {
    router.push("/user/signin");
    setActiveButton(null);
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

      {/* Hamburger menu button */}
      <div className="block lg:hidden">
        <button
          className="text-gray-800 focus:outline-none"
          onClick={() => handleHamburgerClick("menu")}
        >
          <MdMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Nav items */}
      {activeButton === "menu" && (
        <div
          ref={menuRef}
          className="absolute top-8 z-40 px-4 right-0 rounded-md py-8 w-full mt-4 md:hidden bg-white"
        >
          <hr />
          <p>Hi! {fullName}</p>

          <ul className="flex flex-col font-medium">
            <li>
              <button
                className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                onClick={() => {
                  onNavigate("camp_rules");
                  setActiveButton(null);
                }}
              >
                Camp rules
              </button>
            </li>
            <li>
              <button
                className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                onClick={handleLiveChatClick}
              >
                Live Chat
              </button>
              {liveChatMenuOpen && (
                <ul className="mt-2 ml-4">
                  <li>
                    <button
                      className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                      onClick={() => {
                        onNavigate("live_chat_medical_team");
                        setActiveButton(null);
                      }}
                    >
                      Medical Team
                    </button>
                  </li>
                  <li>
                    <button
                      className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                      onClick={() => {
                        onNavigate("live_chat_welfare_team");
                        setActiveButton(null);
                      }}
                    >
                      Welfare Team
                    </button>
                  </li>

                  <li>
                    <button
                      className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                      onClick={() => {
                        onNavigate("live_chat_media_team");
                        setActiveButton(null);
                      }}
                    >
                      Media Team
                    </button>
                  </li>
                  <li>
                    <button
                      className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                      onClick={() => {
                        onNavigate("live_chat_ask_it");
                        setActiveButton(null);
                      }}
                    >
                      Ask it
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <hr />
            <li>
              <button
                className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                onClick={handleSignOut}
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
