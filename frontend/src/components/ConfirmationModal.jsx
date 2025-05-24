import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // "danger" or "warning"
}) => {
  if (!isOpen) return null;

  const getConfirmButtonColor = () => {
    return type === "danger"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-orange-500 hover:bg-orange-600";
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      <motion.div
        className="bg-[#f1f1f2] dark:bg-[#0d0c0c] text-[#0d0c0c] dark:text-[#f1f1f2] rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl z-10"
        initial={{
          scale: 0.7,
          y: 50,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          y: 0,
          opacity: 1,
        }}
        exit={{
          scale: 0.7,
          y: 50,
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-full ${type === "danger" ? "bg-red-100 dark:bg-red-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}
          >
            <AlertTriangle
              className={`w-5 h-5 ${type === "danger" ? "text-red-500" : "text-orange-500"}`}
            />
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        {/* Message */}
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {cancelText}
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors duration-200 ${getConfirmButtonColor()}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {confirmText}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;
