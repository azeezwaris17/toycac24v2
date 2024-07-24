// src/pages/user/dashboard.js

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/user/layout/Layout";
import Sidebar from "@/components/user/sidebar/Sidebar";
import CampRules from "@/components/user/campRules/camp_rules";
import LiveChat from "../../components/user/livechat/LiveChat";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("camp_rules");
  const user = useSelector((state) => state.userSigninAuth.user);
  const router = useRouter();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    username: "",
    proofofPayment: "",
  });

  useEffect(() => {
    // Redirect to sign-in if user data is not available
    if (!user || !user.success) {
      router.push("/user/signin");
    } else {
      const { fullName, email, uniqueID, proofofPayment } = user.data;
      setUserData({
        fullName: fullName,
        email: email,
        username: uniqueID,
        proof_of_payment: proofofPayment,
      });
    }
  }, [user, router]);

  const handleNavigate = (path) => {
    let newPath;
    if (["live_chat_medical_team", "live_chat_welfare_team", "live_chat_media_team", "live_chat_ask_it"].includes(path)) {
      newPath = `/user/livechat/${path}`;
    } else {
      newPath = `/user/${path}`;
    }
    window.history.replaceState({}, document.title, newPath);
    setActiveComponent(path);
  };
  
  const renderComponent = () => {
    switch (activeComponent) {
      case "camp_rules":
        return <CampRules userData={userData} />;
      case "live_chat_medical_team":
        return <LiveChat team="medical" />;
      case "live_chat_welfare_team":
        return <LiveChat team="welfare" />;
        case "live_chat_media_team":
        return <LiveChat team="media" />;
      case "live_chat_ask_it":
        return <LiveChat team="ask_it" />;
      default:
        return <CampRules userData={userData} />;
    }
  };

  // Render loading state if user data is not available yet
  if (!user || !user.success) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-bounce">
        Loading...
      </div>
    );
  }

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
