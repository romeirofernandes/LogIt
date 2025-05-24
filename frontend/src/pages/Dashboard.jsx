import React from "react";
import Persistence from "../components/Persistence";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="bg-[#f1f1f2] dark:bg-[#0d0c0c] text-[#0d0c0c] dark:text-[#f1f1f2] min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto flex flex-col min-h-screen">
        <Navbar />
        <div>
          <Persistence />
        </div>
        <div className="flex-grow">{/* Dashboard content can go here */}</div>
      </div>
    </div>
  );
};

export default Dashboard;
