import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const HabitModal = ({ isOpen, onClose, onSubmit }) => {
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onSubmit({
        name: habitName.trim(),
        description: description.trim(),
      });
      setHabitName("");
      setDescription("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-[#f1f1f2] dark:bg-[#0d0c0c] text-[#0d0c0c] dark:text-[#f1f1f2] rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md relative shadow-2xl"
        layoutId="modal-container"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 p-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </motion.button>

        <motion.h2
          className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          Add New Habit
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div>
            <label className="block text-sm font-medium mb-2">Habit Name</label>
            <motion.input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g., Exercise, Read, Meditate"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1995ad] focus:border-transparent text-sm sm:text-base"
              required
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <motion.textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any details about your habit..."
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1995ad] focus:border-transparent resize-none text-sm sm:text-base"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <motion.button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:scale-95 transition-all duration-200 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="w-full sm:flex-1 px-4 py-2 bg-[#1995ad] text-white rounded-lg hover:scale-95 transition-all duration-200 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layoutId="add-habit-button"
            >
              Add Habit
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default HabitModal;
