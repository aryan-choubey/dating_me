import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main_layout">

      <Sidebar />

      <main className="main_content">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;