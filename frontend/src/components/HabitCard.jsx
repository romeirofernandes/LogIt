import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import ContributionGraph from "./ContributionGraph";
import { dateUtils } from "../utils/dateUtils";
import { habitService } from "../services/habitService";

const HabitCard = ({ habit, onUpdate, index }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const today = dateUtils.getTodayIST();
  const isCompletedToday = habit.completions?.includes(today);
  const currentStreak = dateUtils.calculateStreak(habit.completions || []);

  const handleComplete = async () => {
    if (isCompletedToday || isCompleting) return;

    setIsCompleting(true);
    try {
      const newCompletions = [...(habit.completions || []), today];
      const newCurrentStreak = dateUtils.calculateStreak(newCompletions);
      const newLongestStreak = Math.max(
        habit.longestStreak || 0,
        newCurrentStreak
      );

      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
      };

      await habitService.completeHabit(habit.id, {
        completions: newCompletions,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
      });

      onUpdate(updatedHabit);
    } catch (error) {
      console.error("Error completing habit:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getButtonText = () => {
    if (isCompletedToday) return "Completed!";
    if (currentStreak === 0) return "LogIt";
    return `${currentStreak} day streak`;
  };

  const getButtonColor = () => {
    if (isCompletedToday) return "bg-green-500";
    return "bg-[#1995ad] hover:bg-[#a1d6e2]";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#0d0c0c] dark:text-[#f1f1f2] mb-1">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              {habit.description}
            </p>
          )}
        </div>

        {/* Streak indicator */}
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              {currentStreak}
            </span>
          </div>
        )}
      </div>

      {/* Contribution Graph */}
      <ContributionGraph
        completions={habit.completions || []}
        createdAt={habit.createdAt}
        className="mb-4"
      />

      {/* Stats and Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span>Current: {currentStreak} days</span>
          <span>Best: {habit.longestStreak || 0} days</span>
        </div>

        <motion.button
          onClick={handleComplete}
          disabled={isCompletedToday || isCompleting}
          className={`
            px-4 py-2 text-white rounded-lg font-medium transition-all duration-200
            ${getButtonColor()}
            ${isCompletedToday || isCompleting ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
          `}
          whileHover={!isCompletedToday && !isCompleting ? { scale: 1.05 } : {}}
          whileTap={!isCompletedToday && !isCompleting ? { scale: 0.95 } : {}}
        >
          {isCompleting ? "Logging..." : getButtonText()}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HabitCard;
