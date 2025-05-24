import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";
import { dateUtils } from "../../utils/dateUtils";

const WeeklyHeatmap = ({ habits }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!habits?.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 sm:p-6 shadow-lg h-full flex items-center justify-center mt-6">
        <p className="text-zinc-500 dark:text-zinc-400">No habits to display</p>
      </div>
    );
  }

  const generateTrendData = () => {
    const data = [];
    const today = new Date();
    const daysToShow = 30;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = dateUtils.getDateStringIST(date);

      const completedHabits = habits.filter((habit) =>
        habit.completions?.includes(dateString)
      ).length;

      const completionPercentage = (completedHabits / habits.length) * 100;

      data.push({
        date: dateString,
        completedHabits,
        totalHabits: habits.length,
        percentage: completionPercentage,
        isToday: dateString === dateUtils.getTodayIST(),
      });
    }

    return data;
  };

  const data = generateTrendData();

  // Responsive chart dimensions - adjusted for better visibility
  const chartPadding = 60;
  const chartWidth = 800;
  const chartHeight = 150;
  const topPadding = 20;
  const innerWidth = chartWidth - chartPadding * 2;

  // Create simple, clean paths
  const createPath = () => {
    if (data.length === 0) return "";

    return data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * innerWidth;
        const y =
          topPadding +
          (chartHeight - topPadding) -
          (point.percentage / 100) * (chartHeight - topPadding);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const createAreaPath = () => {
    if (data.length === 0) return "";

    const linePath = createPath();
    return `${linePath} L ${innerWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Calculate stats
  const avgCompletion =
    data.length > 0
      ? Math.round(
          data.reduce((sum, day) => sum + day.percentage, 0) / data.length
        )
      : 0;

  const bestDay = data.reduce(
    (best, day) => (day.percentage > best.percentage ? day : best),
    { percentage: 0 }
  );

  const recentAvg =
    data.length > 7
      ? data.slice(-7).reduce((sum, day) => sum + day.percentage, 0) / 7
      : 0;

  const earlierAvg =
    data.length > 14
      ? data.slice(0, 7).reduce((sum, day) => sum + day.percentage, 0) / 7
      : 0;

  const trend = recentAvg - earlierAvg;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 sm:p-6 shadow-lg mt-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#1995ad]" />
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[#0d0c0c] dark:text-[#f1f1f2]">
            30-Day Completion Trend
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Daily habit completion percentage
          </p>
        </div>
      </div>

      {/* Chart Container - Full Width */}
      <div className="relative mb-6 sm:mb-8">
        <svg
          width="100%"
          height={chartHeight + 50}
          viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`}
          className="w-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percentage) => (
            <g key={percentage}>
              <line
                x1={chartPadding}
                y1={
                  topPadding +
                  (chartHeight - topPadding) -
                  (percentage / 100) * (chartHeight - topPadding)
                }
                x2={chartWidth - chartPadding}
                y2={
                  topPadding +
                  (chartHeight - topPadding) -
                  (percentage / 100) * (chartHeight - topPadding)
                }
                stroke="currentColor"
                strokeWidth="1"
                className="text-zinc-200 dark:text-zinc-700"
                opacity="0.5"
              />
              <text
                x={chartPadding - 10}
                y={
                  topPadding +
                  (chartHeight - topPadding) -
                  (percentage / 100) * (chartHeight - topPadding) +
                  4
                }
                fill="currentColor"
                className="text-zinc-500 dark:text-zinc-400"
                textAnchor="end"
                fontSize="10"
              >
                {percentage}%
              </text>
            </g>
          ))}

          {/* Chart content */}
          <g transform={`translate(${chartPadding}, 0)`}>
            {/* Area fill */}
            <motion.path
              d={createAreaPath()}
              fill="url(#gradient)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Main line */}
            <motion.path
              d={createPath()}
              stroke="#1995ad"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * innerWidth;
              const y =
                topPadding +
                (chartHeight - topPadding) -
                (point.percentage / 100) * (chartHeight - topPadding);

              return (
                <motion.g key={index}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={hoveredPoint === index ? 5 : 3}
                    fill="#1995ad"
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.02 + 0.8 }}
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Today indicator */}
                  {point.isToday && (
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="none"
                      stroke="#1995ad"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.7 }}
                      transition={{ delay: 2 }}
                    />
                  )}
                </motion.g>
              );
            })}
          </g>

          {/* X-axis labels */}
          <g transform={`translate(${chartPadding}, ${chartHeight + 15})`}>
            <text
              x="0"
              y="12"
              fill="currentColor"
              className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm"
              textAnchor="start"
              fontSize="9"
            >
              {formatDate(data[0]?.date)}
            </text>
            <text
              x={innerWidth / 2}
              y="12"
              fill="currentColor"
              className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm"
              textAnchor="middle"
              fontSize="9"
            >
              15 days ago
            </text>
            <text
              x={innerWidth}
              y="12"
              fill="currentColor"
              className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm"
              textAnchor="end"
              fontSize="9"
            >
              Today
            </text>
          </g>

          {/* Gradient */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1995ad" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1995ad" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <motion.div
            className="absolute bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm pointer-events-none z-20 shadow-lg whitespace-nowrap"
            style={{
              left: `${7.5 + (hoveredPoint / (data.length - 1)) * 85}%`,
              top: `${topPadding + ((100 - data[hoveredPoint].percentage) / 100) * (chartHeight - topPadding)}px`,
              transform: "translate(-50%, -120%)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center">
              <div className="font-medium text-xs sm:text-sm">
                {formatDate(data[hoveredPoint].date)}
              </div>
              <div className="text-xs opacity-90">
                {data[hoveredPoint].completedHabits}/
                {data[hoveredPoint].totalHabits} habits
              </div>
              <div className="text-xs font-bold">
                {Math.round(data[hoveredPoint].percentage)}% completed
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
          </motion.div>
        )}
      </div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-3 gap-2 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-center p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mx-auto mb-1" />
          <p className="text-sm sm:text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
            {avgCompletion}%
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Average</p>
        </div>

        <div className="text-center p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mx-auto mb-1" />
          <p className="text-sm sm:text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
            {Math.round(bestDay.percentage)}%
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Best Day</p>
        </div>

        <div className="text-center p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
          <div
            className={`w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1 ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend >= 0 ? "📈" : "📉"}
          </div>
          <p className="text-sm sm:text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
            {trend >= 0 ? "+" : ""}
            {Math.round(trend)}%
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Trend</p>
        </div>
      </motion.div>

      {/* Explanation */}
      <motion.div
        className="mt-3 sm:mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Shows daily completion percentage over the last 30 days
        </p>
      </motion.div>
    </div>
  );
};

export default WeeklyHeatmap;
