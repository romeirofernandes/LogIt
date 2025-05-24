import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Flame,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { habitService } from "../services/habitService";
import { dateUtils } from "../utils/dateUtils";

import StreakChart from "../components/charts/StreakChart";
import CompletionRate from "../components/charts/CompletionRate";
import WeeklyHeatmap from "../components/charts/WeeklyHeatmap";
import MonthlyProgress from "../components/charts/MonthlyProgress";
import HabitComparison from "../components/charts/HabitComparison";

const Stats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHabits();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadHabits = async () => {
    try {
      const userHabits = await habitService.getUserHabits(user.uid);
      setHabits(userHabits);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!habits.length) return null;

    const totalHabits = habits.length;
    const totalCompletions = habits.reduce(
      (sum, habit) => sum + (habit.completions?.length || 0),
      0
    );
    const currentStreaks = habits.map((habit) =>
      dateUtils.calculateStreak(habit.completions || [])
    );
    const longestStreak = Math.max(
      ...habits.map((habit) => habit.longestStreak || 0)
    );
    const today = dateUtils.getTodayIST();
    const completedToday = habits.filter((habit) =>
      habit.completions?.includes(today)
    ).length;

    // Generate 30 days of data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return dateUtils.getDateStringIST(date);
    });

    const monthlyCompletions = last30Days.map((date) =>
      habits.reduce(
        (count, habit) => count + (habit.completions?.includes(date) ? 1 : 0),
        0
      )
    );

    return {
      totalHabits,
      totalCompletions,
      longestStreak,
      averageStreak:
        Math.round(
          (currentStreaks.reduce((sum, streak) => sum + streak, 0) /
            totalHabits) *
            10
        ) / 10,
      todayCompletionRate: Math.round((completedToday / totalHabits) * 100),
      completedToday,
      monthlyCompletions,
      last30Days,
    };
  };

  // Simplified empty state component
  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="bg-[#f1f1f2] dark:bg-[#0d0c0c] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark mt-2 px-3 sm:px-5 py-3 sm:py-4 flex flex-row items-center justify-between transition-colors duration-300">
          <h1
            className="text-2xl sm:text-3xl font-bold cursor-pointer dark:text-background-light text-background-dark"
            onClick={() => navigate("/")}
          >
            LogIt
          </h1>
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            <ThemeToggle />
            <button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-white rounded-full hover:scale-95 transition-all duration-200 text-sm sm:text-base"
              onClick={() => navigate("/")}
            >
              <span className="hidden sm:inline">home</span>
              <span className="sm:hidden">home</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Icon className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#0d0c0c] dark:text-[#f1f1f2] mb-2">
              {title}
            </h2>
            {description && (
              <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );

  // Chart wrapper component
  const ChartWrapper = ({ children, delay, className = "col-span-12" }) => (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );

  const stats = calculateStats();

  if (loading)
    return <EmptyState icon={BarChart3} title="Loading your stats..." />;
  if (!user)
    return (
      <EmptyState
        icon={BarChart3}
        title="Sign in to view stats"
        description="Track your habits to see amazing insights and statistics!"
      />
    );
  if (!habits.length)
    return (
      <EmptyState
        icon={PieChart}
        title="No habits to analyze"
        description="Create some habits first to see your progress statistics!"
      />
    );

  const statCards = [
    {
      icon: Target,
      label: "Total Habits",
      value: stats.totalHabits,
      color: "bg-blue-500",
    },
    {
      icon: Flame,
      label: "Longest Streak",
      value: `${stats.longestStreak} days`,
      color: "bg-orange-500",
    },
    {
      icon: TrendingUp,
      label: "Avg Streak",
      value: `${stats.averageStreak} days`,
      color: "bg-green-500",
    },
    {
      icon: Award,
      label: "Total Logs",
      value: stats.totalCompletions,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="bg-[#f1f1f2] dark:bg-[#0d0c0c] min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark mt-2 px-3 sm:px-5 py-3 sm:py-4 flex flex-row items-center justify-between transition-colors duration-300">
          <h1
            className="text-2xl sm:text-3xl font-bold cursor-pointer dark:text-background-light text-background-dark"
            onClick={() => navigate("/")}
          >
            LogIt
          </h1>
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            <ThemeToggle />
            <button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-white rounded-full hover:scale-95 transition-all duration-200 text-sm sm:text-base"
              onClick={() => navigate("/")}
            >
              <span className="hidden sm:inline">home</span>
              <span className="sm:hidden">home</span>
            </button>
          </div>
        </div>

        <motion.div
          className="mb-8 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Track your progress and celebrate your wins!
          </p>
        </motion.div>

        <div className="pb-8 space-y-6">
          {/* Quick Stats Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {statCards.map((stat, index) => (
              <StatCard key={stat.label} {...stat} delay={0.1 + index * 0.05} />
            ))}
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-12 gap-4">
            <ChartWrapper delay={0.3} className="col-span-12 lg:col-span-8">
              <CompletionRate habits={habits} />
            </ChartWrapper>

            <ChartWrapper delay={0.4} className="col-span-12 lg:col-span-4">
              <TodayProgress
                completed={stats.completedToday}
                total={stats.totalHabits}
                percentage={stats.todayCompletionRate}
              />
            </ChartWrapper>

            <ChartWrapper delay={0.5} className="col-span-12">
              <WeeklyHeatmap habits={habits} />
            </ChartWrapper>

            <ChartWrapper delay={0.6} className="col-span-12 lg:col-span-6">
              <StreakChart habits={habits} />
            </ChartWrapper>

            <ChartWrapper delay={0.7} className="col-span-12 lg:col-span-6">
              <MonthlyProgress
                data={stats.monthlyCompletions}
                dates={stats.last30Days}
              />
            </ChartWrapper>

            <ChartWrapper delay={0.8} className="col-span-12">
              <HabitComparison habits={habits} />
            </ChartWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified StatCard component
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -2, scale: 1.02 }}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
        <p className="text-lg font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

// Today's Progress Component
const TodayProgress = ({ completed, total, percentage }) => (
  <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg h-full">
    <div className="flex items-center gap-2 mb-4">
      <Calendar className="w-5 h-5 text-[#1995ad]" />
      <h3 className="font-semibold text-[#0d0c0c] dark:text-[#f1f1f2]">
        Today's Progress
      </h3>
    </div>

    <div className="text-center">
      <motion.div
        className="relative w-24 h-24 mx-auto mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-200 dark:text-zinc-700"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
            className="text-[#1995ad]"
            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100),
            }}
            transition={{ delay: 0.7, duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-[#0d0c0c] dark:text-[#f1f1f2]">
            {percentage}%
          </span>
        </div>
      </motion.div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {completed} of {total} habits completed
      </p>
    </div>
  </div>
);

export default Stats;
