import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trash2 } from "lucide-react";
import ContributionGraph from "./ContributionGraph";
import ConfirmationModal from "./ConfirmationModal";
import { dateUtils } from "../utils/dateUtils";
import { habitService } from "../services/habitService";

const HabitCard = ({ habit, onUpdate, onDelete, index }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setShowDeleteModal(false);
    try {
      await habitService.deleteHabit(habit.id);
      onDelete(habit.id);
    } catch (error) {
      console.error("Error deleting habit:", error);
    } finally {
      setIsDeleting(false);
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
    <>
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
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

          <div className="flex items-center gap-2">
            {/* Streak indicator */}
            {currentStreak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  {currentStreak}
                </span>
              </div>
            )}

            <motion.button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="p-2 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Delete habit"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <ContributionGraph
          completions={habit.completions || []}
          createdAt={habit.createdAt}
          className="mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Current: {currentStreak} days</span>
            <span>Best: {habit.longestStreak || 0} days</span>
            <span>Total: {habit.completions?.length || 0} days</span>
          </div>

          <motion.button
            onClick={handleComplete}
            disabled={isCompletedToday || isCompleting}
            className={`
              px-4 py-2 text-white rounded-lg font-medium transition-all duration-200
              ${getButtonColor()}
              ${isCompletedToday || isCompleting ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            `}
            whileHover={
              !isCompletedToday && !isCompleting ? { scale: 1.05 } : {}
            }
            whileTap={!isCompletedToday && !isCompleting ? { scale: 0.95 } : {}}
          >
            {isCompleting ? "Logging..." : getButtonText()}
          </motion.button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete Habit"
            message={`Are you sure you want to delete "${habit.name}"? This action cannot be undone and you'll lose all your progress.`}
            confirmText="Delete"
            cancelText="Cancel"
            type="danger"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HabitCard;
