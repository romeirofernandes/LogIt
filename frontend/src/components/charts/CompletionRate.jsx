import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { dateUtils } from "../../utils/dateUtils";

const CompletionRate = ({ habits }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    calculateWeeklyData();
  }, [habits]);

  const calculateWeeklyData = () => {
    const weeks = [];
    const today = new Date();

    // Get last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - i * 7 - today.getDay());

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekDates = [];
      for (
        let d = new Date(weekStart);
        d <= weekEnd;
        d.setDate(d.getDate() + 1)
      ) {
        weekDates.push(dateUtils.getDateStringIST(d));
      }

      const totalPossible = habits.length * 7;
      const completed = weekDates.reduce((count, date) => {
        return (
          count +
          habits.reduce((habitCount, habit) => {
            return habitCount + (habit.completions?.includes(date) ? 1 : 0);
          }, 0)
        );
      }, 0);

      const percentage =
        totalPossible > 0 ? (completed / totalPossible) * 100 : 0;

      weeks.push({
        week: `Week ${8 - i}`,
        percentage: Math.round(percentage),
        completed,
        total: totalPossible,
        dates: weekDates,
      });
    }

    setWeeklyData(weeks);

    // Calculate trend
    if (weeks.length >= 2) {
      const current = weeks[weeks.length - 1].percentage;
      const previous = weeks[weeks.length - 2].percentage;
      const change = current - previous;
      setTrend({ change, isPositive: change >= 0 });
    }
  };

  const maxPercentage = Math.max(...weeklyData.map((w) => w.percentage), 1);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#0d0c0c] dark:text-[#f1f1f2]">
            Weekly Completion Rate
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Your consistency over the past 8 weeks
          </p>
        </div>

        {trend && (
          <motion.div
            className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              trend.isPositive
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {trend.isPositive ? "+" : ""}
              {trend.change}%
            </span>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        {weeklyData.map((week, index) => (
          <motion.div
            key={week.week}
            className="group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {week.week}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {week.completed}/{week.total}
              </span>
            </div>

            <div className="relative">
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-all duration-300 ${
                    week.percentage >= 80
                      ? "bg-green-500"
                      : week.percentage >= 60
                        ? "bg-yellow-500"
                        : week.percentage >= 40
                          ? "bg-orange-500"
                          : "bg-red-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(week.percentage / maxPercentage) * 100}%`,
                  }}
                  transition={{
                    delay: index * 0.1 + 0.3,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                />
              </div>

              <motion.div
                className="absolute right-2 -top-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
              >
                {week.percentage}%
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Average</p>
            <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
              {Math.round(
                weeklyData.reduce((sum, w) => sum + w.percentage, 0) /
                  weeklyData.length
              ) || 0}
              %
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Best Week
            </p>
            <p className="text-lg font-bold text-green-500">
              {Math.max(...weeklyData.map((w) => w.percentage), 0)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              This Week
            </p>
            <p className="text-lg font-bold text-[#1995ad]">
              {weeklyData[weeklyData.length - 1]?.percentage || 0}%
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompletionRate;
