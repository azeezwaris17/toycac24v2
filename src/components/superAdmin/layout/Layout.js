import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../../Footer";

const Layout = ({
  children,
  activeComponent,
  setActiveComponent,
  adminData,
}) => {
  const handleNavigate = (path) => {
    // Your handleNavigate logic
    const newPath =
      path === "dashboard" ? "/super_admin/dashboard" : `/super_admin/${path}`;
    window.history.replaceState({}, document.title, newPath);
    setActiveComponent(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <Navbar
          onNavigate={handleNavigate}
          username={adminData.username}
          role={adminData.role}
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
