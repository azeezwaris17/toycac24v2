import React, { useState } from "react";
import { useRouter } from "next/router";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Modal } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";

export default function Footer() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const correctPasskey = "TOYCAC24-SADM-001";

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    if (passkey === correctPasskey) {
      router.push("/super_admin/create_account");
    } else {
      toast.error("Incorrect passkey. Please enter the correct passkey.");
      setIsModalOpen(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full bg-transparent">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between sm:mx-auto p-2 my-3 rounded-md">
        {/*toaster  */}
        <div className="">
          <Toaster position="bottom-center" reverseOrder={false}></Toaster>
        </div>

        <div className="flex justify-center items-center space-x-1">
          <p className=" text-[#647862]  sm:mb-0">&copy; {currentYear} </p>
          <p className="hover:underline">TOYCAC&apos;24</p>
          <p>Allrights reserved.</p>
        </div>

        <div className="flex justify-center items-center space-x-1">
          <button
            type="button"
            className="text-[#647862] font-medium rounded-lg text-sm px-4 py-2 text-center"
            onClick={handleButtonClick}
          >
            <MdOutlineAdminPanelSettings />
          </button>
        </div>
      </div>
      {/* Modal for passkey */}
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        title="Enter Passkey"
      >
        <div className="flex flex-col items-center">
          <input
            type="password"
            placeholder="Enter passkey"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            className="w-full px-3 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
          />
          <div className="flex justify-end w-full">
            <button
              className="px-4 py-2 mr-2 bg-[#647862] text-white rounded-lg hover:bg-[#DFBF76] focus:outline-none"
              onClick={handleModalConfirm}
              disabled={!passkey} // Disable confirm button if passkey is empty
            >
              {passkey ? (
                <span>Confirm</span>
              ) : (
                <span className="animate-pulse">Enter Passkey</span>
              )}
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
              onClick={handleModalClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </footer>
  );
}
