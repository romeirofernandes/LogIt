import React from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="text-neutral-800 mt-2 px-5 py-4 flex flex-row items-center justify-between">
      <h1
        className="text-3xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        LogIt
      </h1>
      <div
        className="flex flex-row items-center
      justify-between gap-4"
      >
        <ThemeToggle />
        <button
          className="px-4 py-2 bg-[#1995AD] text-white rounded-full hover:scale-95 transition-transform duration-200"
          onClick={() => navigate("/stats")}
        >
          fancy stats
        </button>
      </div>
    </div>
  );
};

export default Navbar;
