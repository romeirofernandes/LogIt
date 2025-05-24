import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { dateUtils } from "../../utils/dateUtils";

const WeeklyHeatmap = ({ habits }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    generateHeatmapData();
  }, [habits]);

  const generateHeatmapData = () => {
    if (!habits.length) return;

    const weeks = [];
    const today = new Date();
    const totalWeeks = 42;

    // Calculate stats
    let totalCompletions = 0;
    let bestDay = { count: 0, date: null };
    let streakDays = 0;

    for (let weekIndex = totalWeeks - 1; weekIndex >= 0; weekIndex--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - weekIndex * 7 - today.getDay());

      const weekData = [];

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + dayIndex);
        const dateStr = dateUtils.getDateStringIST(currentDate);

        // Count completions for this day
        const completions = habits.reduce((count, habit) => {
          return count + (habit.completions?.includes(dateStr) ? 1 : 0);
        }, 0);

        const completionRate =
          habits.length > 0 ? (completions / habits.length) * 100 : 0;

        totalCompletions += completions;

        if (completions > bestDay.count) {
          bestDay = { count: completions, date: dateStr };
        }

        if (completions > 0) {
          streakDays++;
        }

        weekData.push({
          date: dateStr,
          completions,
          completionRate,
          dayOfWeek: dayIndex,
          weekIndex: totalWeeks - 1 - weekIndex,
          isToday: dateStr === dateUtils.getTodayIST(),
          isFuture: currentDate > today,
        });
      }

      weeks.push(weekData);
    }

    setHeatmapData(weeks);

    const avgCompletions = totalCompletions / (totalWeeks * 7);
    const weeklyAvg = totalCompletions / totalWeeks;

    setStats({
      totalCompletions,
      avgCompletions: Math.round(avgCompletions * 10) / 10,
      weeklyAvg: Math.round(weeklyAvg * 10) / 10,
      bestDay,
      activeDays: heatmapData.flat().filter((day) => day.completions > 0)
        .length,
    });
  };

  const getIntensityColor = (completionRate) => {
    if (completionRate === 0) return "bg-zinc-100 dark:bg-zinc-800";
    if (completionRate <= 25) return "bg-green-200 dark:bg-green-900/40";
    if (completionRate <= 50) return "bg-green-300 dark:bg-green-700/60";
    if (completionRate <= 75) return "bg-green-400 dark:bg-green-600/80";
    return "bg-green-500 dark:bg-green-500";
  };

  const getBorderColor = (day) => {
    if (day.isToday) return "ring-2 ring-[#1995ad] ring-offset-1";
    if (day.isFuture)
      return "border border-zinc-300 dark:border-zinc-600 opacity-30";
    return "";
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels = [];

  // Generate month labels
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    monthLabels.push(month);
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1995ad]" />
          <div>
            <h3 className="text-lg font-semibold text-[#0d0c0c] dark:text-[#f1f1f2]">
              Activity Heatmap
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              42 weeks of habit completion patterns
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
              {stats.totalCompletions}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">Total</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
              {stats.weeklyAvg}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">Weekly Avg</p>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative overflow-x-auto">
        <div className="flex gap-1 mb-2 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1 w-8">
            <div className="h-4"></div> {/* Space for month labels */}
            {dayLabels.map((day, index) => (
              <div
                key={day}
                className="h-3 text-xs text-zinc-600 dark:text-zinc-400 flex items-center"
              >
                {index % 2 === 1 ? day : ""}{" "}
                {/* Show every other day to avoid crowding */}
              </div>
            ))}
          </div>

          {/* Heatmap cells */}
          <div className="flex-1">
            {/* Month labels */}
            <div className="flex gap-1 mb-1 h-4">
              {monthLabels.map((month, index) => (
                <div
                  key={index}
                  className="text-xs text-zinc-600 dark:text-zinc-400 flex-1 text-center"
                >
                  {index % 3 === 0 ? month : ""} {/* Show every 3rd month */}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 ${getIntensityColor(day.completionRate)} ${getBorderColor(day)}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: day.isFuture ? 0.3 : 1 }}
                      transition={{
                        delay: (weekIndex * 7 + dayIndex) * 0.01,
                        duration: 0.3,
                      }}
                      whileHover={{
                        scale: 1.3,
                        zIndex: 10,
                        transition: { duration: 0.1 },
                      }}
                      onMouseEnter={() => setHoveredCell(day)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <motion.div
            className="absolute bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-2 rounded-lg text-sm pointer-events-none z-20 shadow-lg"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -120%)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center">
              <div className="font-medium">{formatDate(hoveredCell.date)}</div>
              <div className="text-xs mt-1">
                {hoveredCell.completions} of {habits.length} habits completed
              </div>
              <div className="text-xs">
                {Math.round(hoveredCell.completionRate)}% completion rate
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
          </motion.div>
        )}
      </div>

      {/* Legend and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
        {/* Intensity Legend */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Less</span>
          <div className="flex gap-1">
            {[0, 25, 50, 75, 100].map((intensity) => (
              <div
                key={intensity}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">More</span>
        </div>

        {/* Best Day */}
        {stats.bestDay?.date && (
          <motion.div
            className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">
              Best day: {stats.bestDay.count} completions
            </span>
          </motion.div>
        )}
      </div>

      {/* Additional Insights */}
      <motion.div
        className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                Daily Avg
              </span>
            </div>
            <p className="font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
              {stats.avgCompletions}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                Active Days
              </span>
            </div>
            <p className="font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
              {stats.activeDays || 0}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                Best Day
              </span>
            </div>
            <p className="font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
              {stats.bestDay?.count || 0}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                Consistency
              </span>
            </div>
            <p className="font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
              {stats.activeDays ? Math.round((stats.activeDays / 84) * 100) : 0}
              %
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeeklyHeatmap;
