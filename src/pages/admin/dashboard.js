import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/admin/layout/Layout";
import Sidebar from "@/components/admin/sidebar/Sidebar";
import DashboardComponent from "@/components/admin/dashboard/Dashboard";
import RegisteredUsersComponent from "@/components/admin/registered_users/Registered_users";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const admin = useSelector((state) => state.adminSigninAuth.admin);
  const router = useRouter();
  const [userData, setUserData] = useState({ username: "", role: "" });

  useEffect(() => {
    const currentPath = router.pathname;
    if (currentPath === "/admin") {
      window.history.replaceState({}, document.title, "/admin/dashboard");
    }
    if (currentPath === "/admin/dashboard") {
      setActiveComponent("dashboard");
    }

    if (!admin && currentPath === "/admin/dashboard") {
      router.push("/admin/signin");
    }

    if (admin) {
      console.log(admin);
      setUserData({
        username: admin.data.uniqueID,
        role: admin.data.role,
      });
    }
  }, [admin, router]);

  const handleNavigate = (path) => {
    const newPath =
      path === "dashboard" ? "/admin/dashboard" : `/admin/${path}`;
    window.history.replaceState({}, document.title, newPath);
    setActiveComponent(path);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return (
          <DashboardComponent
            username={userData.username}
            role={userData.role}
          />
        );
      case "registeredUsers":
        return <RegisteredUsersComponent />;
      default:
        return null;
    }
  };

  return (
    <Layout
      setActiveComponent={setActiveComponent}
      activeComponent={activeComponent}
      userData={userData}
    >
      <Toaster position="bottom-center" reverseOrder={false} />

      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Sidebar
              onNavigate={handleNavigate}
              activeComponent={activeComponent}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderComponent()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
