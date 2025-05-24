import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Activity, Target } from "lucide-react";

const MonthlyProgress = ({ data, dates }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg h-full flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">No data available</p>
      </div>
    );
  }

  // Calculate simple stats
  const total = data.reduce((sum, day) => sum + day, 0);
  const average = Math.round((total / data.length) * 10) / 10;
  const maxDay = Math.max(...data);
  const activeDays = data.filter((day) => day > 0).length;

  // Fixed height calculation - use pixels instead of percentages
  const maxValue = Math.max(...data, 1);
  const chartHeight = 80; // Fixed height in pixels

  const getBarHeight = (value) => {
    if (value === 0) return 2; // 2px for empty days
    return Math.max(4, (value / maxValue) * chartHeight); // Scale to chart height
  };

  const getBarColor = (value) => {
    if (value === 0) return "bg-zinc-200 dark:bg-zinc-700";
    if (value === maxValue && maxValue > 1) return "bg-yellow-500";
    if (value >= maxValue * 0.7) return "bg-green-500";
    if (value >= maxValue * 0.4) return "bg-blue-500";
    return "bg-orange-500";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg h-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[#1995ad]" />
        <div>
          <h3 className="text-lg font-semibold text-[#0d0c0c] dark:text-[#f1f1f2]">
            30-Day Activity
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Daily completion count
          </p>
        </div>
      </div>

      {/* Chart Area - Fixed pixel height */}
      <div className="relative mb-4 p-3 bg-zinc-50 dark:bg-zinc-900/20 rounded-lg">
        <div
          className="flex items-end justify-between gap-[1px]"
          style={{ height: `${chartHeight}px` }}
        >
          {data.map((value, index) => (
            <div
              key={index}
              className="relative flex-1 flex flex-col justify-end cursor-pointer"
              onMouseEnter={() => setHoveredDay(index)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <motion.div
                className={`w-full rounded-t-sm transition-all duration-200 ${getBarColor(value)} ${
                  hoveredDay === index
                    ? "ring-1 ring-[#1995ad] ring-opacity-50"
                    : ""
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${getBarHeight(value)}px` }}
                transition={{
                  delay: index * 0.02,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              />

              {/* Tooltip */}
              {hoveredDay === index && (
                <motion.div
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-2 rounded-lg text-xs whitespace-nowrap z-20 shadow-lg"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-center">
                    <div className="font-medium">
                      {formatDate(dates[index])}
                    </div>
                    <div>
                      {value} habit{value !== 1 ? "s" : ""} completed
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          <span>{formatDate(dates[0])}</span>
          <span>Today</span>
        </div>
      </div>

      {/* Stats Grid - 2x2 */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
          <Target className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
            {total}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Total</p>
        </div>

        <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
          <Calendar className="w-4 h-4 text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
            {activeDays}/30
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Active Days
          </p>
        </div>

        <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
          <TrendingUp className="w-4 h-4 text-orange-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
            {average}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Daily Avg</p>
        </div>

        <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
          <Activity className="w-4 h-4 text-purple-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
            {maxDay}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Best Day</p>
        </div>
      </motion.div>
    </div>
  );
};

export default MonthlyProgress;
