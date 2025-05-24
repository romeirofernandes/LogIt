import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Persistence from "../components/Persistence";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import HabitModal from "../components/HabitModal";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleAddHabitClick = () => {
    if (user) {
      setIsHabitModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setToastMessage("Successfully signed in!");
    setShowToast(true);
  };

  const handleHabitSubmit = (habitData) => {
    console.log("New habit:", habitData);
    setToastMessage("Habit added successfully!");
    setShowToast(true);
  };

  const isAnyModalOpen = isAuthModalOpen || isHabitModalOpen;

  return (
    <div className="relative">
      {/* Main Content */}
      <motion.div
        className="bg-[#f1f1f2] dark:bg-[#0d0c0c] text-[#0d0c0c] dark:text-[#f1f1f2] min-h-screen transition-colors duration-300"
        animate={{
          filter: isAnyModalOpen ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-3xl mx-auto flex flex-col min-h-screen">
          <Navbar />
          <div>
            <Persistence />
          </div>
          <div className="flex justify-end">
            <motion.button
              onClick={handleAddHabitClick}
              className="px-4 py-2 bg-[#1995ad] hover:scale-95 text-white rounded-full transition-all duration-200 font-medium"
              layoutId="add-habit-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Habit
            </motion.button>
          </div>
          <div className="flex-grow"></div>
        </div>
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isAnyModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence mode="wait">
        {isAuthModalOpen && (
          <AuthModal
            key="auth-modal"
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
        {isHabitModalOpen && (
          <HabitModal
            key="habit-modal"
            isOpen={isHabitModalOpen}
            onClose={() => setIsHabitModalOpen(false)}
            onSubmit={handleHabitSubmit}
          />
        )}
      </AnimatePresence>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
};

export default Dashboard;
