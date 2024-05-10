import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(/toycac24BG.jpg)` }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero section */}
      <section
        className="fixed py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-rows-2 lg:grid-cols-12">
            {/* Left content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 text-[#647862]">
                TIMSAN OYO STATE CAMP AND CONFERENCE 2024
              </h1>
              <p className="text-lg lg:text-xl font-light text-gray-800 italic mb-6 lg:mb-8">
                Igniting Hearts, Transcending Boundaries
              </p>
              <div className="flex flex-col lg:flex-row">
                <Link
                  href="/user/register"
                  className="inline-flex items-center justify-center px-5 py-3 mb-3 lg:mb-0 mr-0 lg:mr-3 text-base font-medium text-[#647862] hover:rounded-lg hover:bg-primary-800"
                >
                  Get started
                  <svg
                    className="w-5 h-5 ml-2 -mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-5 flex justify-center">
              <Image
                src="/camp_latern(2).png"
                alt="camp_latern"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
