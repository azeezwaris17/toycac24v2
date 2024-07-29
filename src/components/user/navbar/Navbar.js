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
         
          <p>Hi! {username}</p>

          <hr />

          <ul className="flex flex-col font-medium">

            {/* camp rules */}
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

            {/* live chat */}
            <li>
              <button
                className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                onClick={handleLiveChatClick}
              >
                Live Chat
              </button>

              {/* live chat submenu */}
              {liveChatMenuOpen && (
                <ul className="mt-2 ml-4">
                  {/* medical team */}
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

                  {/* welfare team */}
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

                  {/* protocol team */}
                  <li>
                    <button
                      className="p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
                      onClick={() => {
                        onNavigate("live_chat_protocol_team");
                        setActiveButton(null);
                      }}
                    >
                      Protocol Team
                    </button>
                  </li>

                  {/* media team */}
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

                  {/* Ask it */}
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
    Signout
  </button>
</li>
          </ul>
        </div>
      )}

      {/* Nav items for larger screens */}
      <div className="hidden lg:flex items-center space-x-2 md:space-x-4">
        <p>Hi! {username}</p>


        <button
          className="hidden p-2 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] rounded-lg"
          onClick={() => handleHamburgerClick("live_chat")}
        >
          <MdChat className="w-6 h-6" />
        </button>
        {activeButton === "live_chat" && (
          <ul
            ref={menuRef}
            className="absolute z-10 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-md right-2"
          >
            <li>
              <button
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
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
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
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
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
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
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
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
        <button
          className="text-white bg-[#647862] hover:bg-[#DFBF76] font-medium rounded-lg text-sm px-4 py-2 text-center"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
