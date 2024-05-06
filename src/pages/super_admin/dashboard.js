import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/superAdmin/layout/Layout";
import Sidebar from "@/components/superAdmin/sidebar/Sidebar";
import DashboardComponent from "@/components/superAdmin/dashboard/Dashboard";
import RegisteredUsersComponent from "@/components/superAdmin/registered_users/Registered_users";
import RegisteredAdminsComponent from "@/components/superAdmin/registered_admins/Registered_admins";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const superAdmin = useSelector(
    (state) => state.superAdminSigninAuth.superAdmin
  );
  // console.log(superAdmin);
  const router = useRouter();
  const [adminData, setAdminData] = useState({ username: "", role: "" });

  useEffect(() => {
    if (superAdmin && superAdmin.success) {
      const { uniqueID, role } = superAdmin.data;
      setAdminData({ username: uniqueID, role });
    } else {
      router.push("/super_admin/signin");
    }
  }, [superAdmin, router]);

  const handleNavigate = (path) => {
    const newPath =
      path === "dashboard" ? "/super_admin/dashboard" : `/super_admin/${path}`;
    window.history.replaceState({}, document.title, newPath);
    setActiveComponent(path);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return (
          <DashboardComponent
            username={adminData.username}
            role={adminData.role}
          />
        );
      case "registeredUsers":
        return <RegisteredUsersComponent />;
      case "registeredAdmins":
        return <RegisteredAdminsComponent />;
      default:
        return null;
    }
  };

  return (
    <Layout
      setActiveComponent={setActiveComponent}
      activeComponent={activeComponent}
      adminData={adminData}
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
