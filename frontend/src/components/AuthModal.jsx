import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-[#f1f1f2] dark:bg-[#0d0c0c] text-[#0d0c0c] dark:text-[#f1f1f2] rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl"
        layoutId="modal-container"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={24} />
        </motion.button>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-2">Welcome to LogIt</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Sign in to start tracking your habits
          </p>

          <motion.button
            onClick={handleGoogleSignIn}
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-[#0d0c0c] dark:text-[#f1f1f2] px-4 py-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-200 flex items-center justify-center gap-3"
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.98 }}
            layoutId="google-signin-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
