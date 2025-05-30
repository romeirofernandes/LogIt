import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

const Toast = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-sm sm:text-base max-w-sm sm:max-w-none mx-auto sm:mx-0"
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <CheckCircle size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
