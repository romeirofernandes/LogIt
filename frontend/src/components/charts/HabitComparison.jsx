import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Target, Flame, Calendar } from "lucide-react";
import { dateUtils } from "../../utils/dateUtils";

const HabitComparison = ({ habits }) => {
  const [sortBy, setSortBy] = useState("streak");
  const [processedHabits, setProcessedHabits] = useState([]);

  useEffect(() => {
    processHabitData();
  }, [habits, sortBy]);

  const processHabitData = () => {
    const today = dateUtils.getTodayIST();

    const processed = habits.map((habit, index) => {
      const currentStreak = dateUtils.calculateStreak(habit.completions || []);
      const totalCompletions = habit.completions?.length || 0;
      const longestStreak = habit.longestStreak || 0;

      // Calculate completion rate for last 30 days
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last30Days.push(dateUtils.getDateStringIST(date));
      }

      const completionsIn30Days = last30Days.filter((date) =>
        habit.completions?.includes(date)
      ).length;
      const completionRate = (completionsIn30Days / 30) * 100;

      const isActiveToday = habit.completions?.includes(today);

      return {
        ...habit,
        currentStreak,
        totalCompletions,
        longestStreak,
        completionRate: Math.round(completionRate),
        isActiveToday,
        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`, // Generate unique colors
      };
    });

    // Sort habits based on selected criteria
    const sorted = [...processed].sort((a, b) => {
      switch (sortBy) {
        case "streak":
          return b.currentStreak - a.currentStreak;
        case "total":
          return b.totalCompletions - a.totalCompletions;
        case "rate":
          return b.completionRate - a.completionRate;
        case "longest":
          return b.longestStreak - a.longestStreak;
        default:
          return 0;
      }
    });

    setProcessedHabits(sorted);
  };

  const getSortIcon = (type) => {
    const icons = {
      streak: Flame,
      total: Calendar,
      rate: Target,
      longest: Trophy,
    };
    return icons[type];
  };

  const getSortValue = (habit, type) => {
    switch (type) {
      case "streak":
        return `${habit.currentStreak} days`;
      case "total":
        return `${habit.totalCompletions} times`;
      case "rate":
        return `${habit.completionRate}%`;
      case "longest":
        return `${habit.longestStreak} days`;
      default:
        return "";
    }
  };

  const maxValue = Math.max(
    ...processedHabits.map((habit) => {
      switch (sortBy) {
        case "streak":
          return habit.currentStreak;
        case "total":
          return habit.totalCompletions;
        case "rate":
          return habit.completionRate;
        case "longest":
          return habit.longestStreak;
        default:
          return 0;
      }
    }),
    1
  );

  const sortOptions = [
    { key: "streak", label: "Current Streak", icon: Flame },
    { key: "total", label: "Total Logs", icon: Calendar },
    { key: "rate", label: "30-Day Rate", icon: Target },
    { key: "longest", label: "Best Streak", icon: Trophy },
  ];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#0d0c0c] dark:text-[#f1f1f2]">
            Habit Comparison
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Compare your habits across different metrics
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              onClick={() => setSortBy(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                sortBy === key
                  ? "bg-[#1995ad] text-white"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {processedHabits.map((habit, index) => {
            const currentValue = (() => {
              switch (sortBy) {
                case "streak":
                  return habit.currentStreak;
                case "total":
                  return habit.totalCompletions;
                case "rate":
                  return habit.completionRate;
                case "longest":
                  return habit.longestStreak;
                default:
                  return 0;
              }
            })();

            const barWidth = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;

            return (
              <motion.div
                key={`${habit.id}-${sortBy}`}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <span className="font-medium text-[#0d0c0c] dark:text-[#f1f1f2]">
                        {habit.name}
                      </span>
                      {habit.isActiveToday && (
                        <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                          ✓ Today
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    {getSortValue(habit, sortBy)}
                  </span>
                </div>

                <div className="relative">
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-4 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full relative overflow-hidden"
                      style={{ backgroundColor: habit.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{
                        delay: index * 0.05 + 0.2,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: [-100, 300] }}
                        transition={{
                          delay: index * 0.05 + 1,
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Rank badge */}
                  {index < 3 && (
                    <motion.div
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : "bg-orange-600"
                      }`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.05 + 1.2, type: "spring" }}
                    >
                      {index + 1}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Podium for top 3 */}
      {processedHabits.length >= 3 && (
        <motion.div
          className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4 text-center">
            🏆 Top Performers
          </h4>
          <div className="flex items-end justify-center gap-4">
            {processedHabits.slice(0, 3).map((habit, index) => {
              const heights = [60, 80, 40]; // 2nd, 1st, 3rd place heights
              const order = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
              const displayIndex = order.indexOf(index);

              return (
                <motion.div
                  key={habit.id}
                  className="flex flex-col items-center"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.7 + displayIndex * 0.1 }}
                >
                  <div
                    className={`w-16 rounded-t-lg flex items-end justify-center pb-2 transition-all duration-300 hover:scale-105`}
                    style={{
                      height: `${heights[index]}px`,
                      backgroundColor: habit.color,
                    }}
                  >
                    <span className="text-white font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-[#0d0c0c] dark:text-[#f1f1f2] truncate max-w-16">
                      {habit.name}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {getSortValue(habit, sortBy)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HabitComparison;
