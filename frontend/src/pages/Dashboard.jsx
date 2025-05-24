import React from "react";
import Persistence from "../components/Persistence";

const Dashboard = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col min-h-screen">
        <div>
          <Persistence />
        </div>
        <div className="flex-grow">{/* Dashboard content can go here */}</div>
      </div>
    </>
  );
};

export default Dashboard;
