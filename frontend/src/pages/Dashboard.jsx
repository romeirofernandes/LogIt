import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Persistence from "../components/Persistence";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import HabitModal from "../components/HabitModal";
import Toast from "../components/Toast";
import HabitsList from "../components/HabitsList";
import { useAuth } from "../context/AuthContext";
import { habitService } from "../services/habitService";

const Dashboard = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Load habits when user changes
  useEffect(() => {
    if (user) {
      loadHabits();
    } else {
      setHabits([]);
      setHasLoadedOnce(false);
    }
  }, [user]);

  const loadHabits = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userHabits = await habitService.getUserHabits(user.uid);
      setHabits(userHabits);
      setHasLoadedOnce(true);
    } catch (error) {
      console.error("Error loading habits:", error);
      setToastMessage("Failed to load habits");
      setShowToast(true);
      setHasLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    setToastMessage("Habit deleted successfully!");
    setShowToast(true);
  };

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

  const handleHabitSubmit = async (habitData) => {
    try {
      const habitId = await habitService.createHabit(user.uid, habitData);
      const newHabit = {
        id: habitId,
        userId: user.uid,
        ...habitData,
        createdAt: new Date(),
        completions: [],
        currentStreak: 0,
        longestStreak: 0,
        order: Date.now(),
      };

      setHabits((prev) => [...prev, newHabit]);
      setToastMessage("Habit added successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error creating habit:", error);
      setToastMessage("Failed to create habit");
      setShowToast(true);
    }
  };

  const handleUpdateHabit = (updatedHabit) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
    );
  };

  const handleReorderHabits = (newOrder) => {
    setHabits(newOrder);
  };

  const isAnyModalOpen = isAuthModalOpen || isHabitModalOpen;

  const renderHabitsSection = () => {
    // Show loading only if we're actually loading and haven't loaded before
    if (loading && !hasLoadedOnce) {
      return (
        <motion.div
          className="flex justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-zinc-500 dark:text-zinc-400">
            Loading habits...
          </div>
        </motion.div>
      );
    }

    return (
      <HabitsList
        habits={habits}
        onUpdateHabit={handleUpdateHabit}
        onReorderHabits={handleReorderHabits}
        onDeleteHabit={handleDeleteHabit}
      />
    );
  };

  return (
    <div className="relative">
      {/* Main Content */}
      <motion.div
        className="bg-[#f1f1f2] dark:bg-[#0d0c0c] text-[#0d0c0c] dark:text-[#f1f1f2] min-h-screen transition-colors duration-300"
        animate={{
          filter: isAnyModalOpen ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-3xl mx-auto flex flex-col min-h-screen">
          <Navbar />
          <div>
            <Persistence />
          </div>

          <div className="flex justify-end mb-6">
            <motion.button
              onClick={handleAddHabitClick}
              className="px-4 py-2 bg-[#1995ad] text-white rounded-full transition-all duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                opacity: isAnyModalOpen ? 0 : 1,
                scale: isAnyModalOpen ? 0.8 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              Add Habit
            </motion.button>
          </div>

          {/* Habits List */}
          <div className="flex-1 pb-8">{renderHabitsSection()}</div>
        </div>
      </motion.div>

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
