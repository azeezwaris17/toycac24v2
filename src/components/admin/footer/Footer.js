import React from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full bg-transparent">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-center  sm:mx-auto p-2 my-3 rounded-md">
        {/*toaster  */}
        <div className="">
          <Toaster position="bottom-center" reverseOrder={false}></Toaster>
        </div>

        <div className="flex justify-center items-center space-x-1">
          <p className=" text-[#647862]  sm:mb-0">&copy; {currentYear} </p>
          <p className="hover:underline">TOYCAC&apos;24</p>
          <p>Allrights reserved.</p>
        </div>

      </div>

    </footer>
  );
}
