import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { MdChat } from "react-icons/md";

export default function Sidebar({ onNavigate, username, fullName }) {
  const [activeButton, setActiveButton] = useState(null);
  const [liveChatMenuOpen, setLiveChatMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const handleLiveChatClick = () => {
    setLiveChatMenuOpen(!liveChatMenuOpen);
  };

  const handleSignOut = () => {
    router.push("/user/signin");
    setActiveButton(null);
  };

  return (
    <aside
      className="hidden lg:block fixed w-64 max-h-screen-[calc(100vh-88px)] p-4 z-10 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 outline outline-offset-2 outline-3 outline-[#647862]"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="space-y-6">
        <button
          className={`flex items-center p-2 text-base font-medium text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] hover:bg-gray-100 rounded-lg ${
            activeButton === "camp_rules" ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            onNavigate("camp_rules");
            setActiveButton("camp_rules");
          }}
        >
          <MdChat className="w-6 h-6 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76]" />
          <span className="ml-3">Camp Rules</span>
        </button>
        <button
          className={`flex items-center p-2 text-base font-medium text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] hover:bg-gray-100 rounded-lg ${
            activeButton === "live_chat" ? "bg-gray-100" : ""
          }`}
          onClick={handleLiveChatClick}
        >
          <MdChat className="w-6 h-6 text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76]" />
          <span className="ml-3">Live Chat</span>
        </button>
        {liveChatMenuOpen && (
          <ul ref={menuRef} className="space-y-2 pl-4">
            <li>
              <button
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  onNavigate("live_chat_medical_team");
                  setActiveButton("live_chat_medical_team");
                  setLiveChatMenuOpen(false);
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
                  setActiveButton("live_chat_welfare_team");
                  setLiveChatMenuOpen(false);
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
                  setActiveButton("live_chat_media_team");
                  setLiveChatMenuOpen(false);
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
                  setActiveButton("live_chat_ask_it");
                  setLiveChatMenuOpen(false);
                }}
              >
                Ask it
              </button>
            </li>
          </ul>
        )}
      </div>
      <div className="mt-auto">
        <button
          className="flex items-center p-2 text-base font-medium text-gray-800 hover:text-[#DFBF76] focus:text-[#DFBF76] hover:bg-gray-100 rounded-lg w-full"
          onClick={handleSignOut}
        >
          <span className="ml-3">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
