import React from "react";
import Persistence from "../components/Persistence";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <>
      <div className="max-w-3xl mx-auto flex flex-col min-h-screen">
        <Navbar />
        <div>
          <Persistence />
        </div>
        <div className="flex-grow">{/* Dashboard content can go here */}</div>
      </div>
    </>
  );
};

export default Dashboard;
