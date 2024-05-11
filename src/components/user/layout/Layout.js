import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const Layout = ({
  children,
  setActiveComponent,
  userData,
}) => {
  const handleNavigate = (path) => {
    // Your handleNavigate logic
    const newPath =
      path === "camp_rules" ? "/user/dashboard" : `/user/${path}`;
    window.history.replaceState({}, document.title, newPath);
    setActiveComponent(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <Navbar
          onNavigate={handleNavigate}
          fullName={userData.fullName}
        />
      </header>

      <main className="flex-1 overflow-y-auto mb-8">{children}</main>

      <footer className="border-t">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
