import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp, Target, Zap } from "lucide-react";
import { dateUtils } from "../../utils/dateUtils";

const StreakChart = ({ habits }) => {
  const [streakData, setStreakData] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    calculateStreakData();
  }, [habits]);

  const calculateStreakData = () => {
    if (!habits.length) return;

    const data = habits.map((habit, index) => {
      const currentStreak = dateUtils.calculateStreak(habit.completions || []);
      const longestStreak = habit.longestStreak || 0;
      const totalCompletions = habit.completions?.length || 0;

      // Calculate streak history for the last 30 days
      const streakHistory = [];
      const today = new Date();

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = dateUtils.getDateStringIST(date);

        // Calculate streak up to this date
        const completionsUpToDate = (habit.completions || [])
          .filter((completion) => completion <= dateStr)
          .sort();

        const streakAtDate = dateUtils.calculateStreakAtDate(
          completionsUpToDate,
          dateStr
        );
        streakHistory.push(streakAtDate);
      }

      return {
        ...habit,
        currentStreak,
        longestStreak,
        totalCompletions,
        streakHistory,
        color: `hsl(${(index * 137.5) % 360}, 50%, 60%)`,
        id: habit.id,
      };
    });

    setStreakData(data);
    if (!selectedHabit && data.length > 0) {
      setSelectedHabit(data[0]);
    }
  };

  const maxStreak = Math.max(
    ...streakData.flatMap((habit) => habit.streakHistory),
    ...streakData.map((habit) => habit.longestStreak),
    1
  );

  const chartHeight = 120;
  const chartWidth = 280;

  const getYPosition = (streak) => {
    return chartHeight - (streak / maxStreak) * chartHeight;
  };

  const createPath = (streakHistory) => {
    if (!streakHistory.length) return "";

    const points = streakHistory
      .map((streak, index) => {
        const x = (index / (streakHistory.length - 1)) * chartWidth;
        const y = getYPosition(streak);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return points;
  };

  const getStreakLevel = (streak) => {
    if (streak >= 30)
      return { level: "Legendary", color: "text-purple-500", icon: "🏆" };
    if (streak >= 21)
      return { level: "Master", color: "text-yellow-500", icon: "⭐" };
    if (streak >= 14)
      return { level: "Expert", color: "text-blue-500", icon: "💎" };
    if (streak >= 7)
      return { level: "Strong", color: "text-green-500", icon: "🔥" };
    if (streak >= 3)
      return { level: "Building", color: "text-orange-500", icon: "📈" };
    return { level: "Starting", color: "text-zinc-500", icon: "🌱" };
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg h-full">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-orange-500" />
        <div>
          <h3 className="text-lg font-semibold text-[#0d0c0c] dark:text-[#f1f1f2]">
            Streak Tracker
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            30-day streak progression
          </p>
        </div>
      </div>

      {/* Habit Selector */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {streakData.map((habit) => (
            <motion.button
              key={habit.id}
              onClick={() => setSelectedHabit(habit)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedHabit?.id === habit.id
                  ? "text-white shadow-lg"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
              }`}
              style={
                selectedHabit?.id === habit.id
                  ? { backgroundColor: habit.color }
                  : {}
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="truncate max-w-20">{habit.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedHabit && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedHabit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Current Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
                  {selectedHabit.currentStreak}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Current
                </p>
              </div>
              <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                <Target className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
                  {selectedHabit.longestStreak}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Best</p>
              </div>
              <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                <Zap className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
                  {selectedHabit.totalCompletions}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Total
                </p>
              </div>
            </div>

            {/* Streak Level */}
            <motion.div
              className="mb-4 text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {(() => {
                const { level, color, icon } = getStreakLevel(
                  selectedHabit.currentStreak
                );
                return (
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-700 ${color}`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="font-semibold">{level} Streak</span>
                  </div>
                );
              })()}
            </motion.div>

            {/* Chart */}
            <div className="relative mb-4">
              <svg
                width="100%"
                height={chartHeight + 20}
                viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
                className="overflow-visible"
              >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <line
                    key={ratio}
                    x1={0}
                    y1={chartHeight * ratio}
                    x2={chartWidth}
                    y2={chartHeight * ratio}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-zinc-200 dark:text-zinc-700"
                    opacity={0.3}
                  />
                ))}

                {/* Area under the curve */}
                <motion.path
                  d={`${createPath(selectedHabit.streakHistory)} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                  fill="url(#gradient)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Main line */}
                <motion.path
                  d={createPath(selectedHabit.streakHistory)}
                  stroke={selectedHabit.color}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Data points */}
                {selectedHabit.streakHistory.map((streak, index) => {
                  const x =
                    (index / (selectedHabit.streakHistory.length - 1)) *
                    chartWidth;
                  const y = getYPosition(streak);

                  return (
                    <motion.circle
                      key={index}
                      cx={x}
                      cy={y}
                      r={hoveredPoint === index ? 6 : 4}
                      fill={selectedHabit.color}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.5 }}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      whileHover={{ scale: 1.5 }}
                    />
                  );
                })}

                {/* Gradient definition */}
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={selectedHabit.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor={selectedHabit.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
              </svg>

              {/* Tooltip */}
              {hoveredPoint !== null && (
                <motion.div
                  className="absolute bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-1 rounded text-xs pointer-events-none z-10"
                  style={{
                    left: `${(hoveredPoint / (selectedHabit.streakHistory.length - 1)) * 100}%`,
                    top: `${(getYPosition(selectedHabit.streakHistory[hoveredPoint]) / chartHeight) * 100}%`,
                    transform: "translate(-50%, -120%)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-center">
                    <div className="font-medium">Day {hoveredPoint + 1}</div>
                    <div>
                      {selectedHabit.streakHistory[hoveredPoint]} day streak
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Y-axis labels */}
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span>30 days ago</span>
              <span>15 days ago</span>
              <span>Today</span>
            </div>

            {/* Progress indicator */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {selectedHabit.currentStreak > 0
                    ? `On a ${selectedHabit.currentStreak} day streak!`
                    : "Start your streak today!"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default StreakChart;
