import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const handleRegisterButtonClick = () => {
    router.push("/user/register");
  };

  const handleSigninButtonClick = () => {
    router.push("/user/signin");
  };

  return (
    <nav
      className="bg-cover bg-center bg-transparent fixed w-full z-20 top-0 start-0"
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-3 sm:mx-auto p-2 my-3 rounded-md border border-[#DFBF76]">
        <div className="flex flex-row space-x-2 items-center">
          <div className="flex flex-row items-center">
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

          <span className="text-xl font-semibold whitespace-nowrap dark:text-white">
            TOYCAC&apos;24
          </span>
        </div>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

        <button
            type="button"
            className="text-[#DFBF76] hover:outline-[#647862] font-medium rounded-lg text-sm px-4 py-2 text-center"
            onClick={handleSigninButtonClick}
          >
           Signin
          </button>

          <button
            type="button"
            className="text-white bg-[#647862] hover:bg-[#DFBF76] font-medium rounded-lg text-sm px-4 py-2 text-center"
            onClick={handleRegisterButtonClick}
          >
            Register
          </button>

         
        </div>
      </div>
    </nav>
  );
}
