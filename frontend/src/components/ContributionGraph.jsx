import React from "react";
import { motion } from "framer-motion";
import { dateUtils } from "../utils/dateUtils";

const ContributionGraph = ({ completions, createdAt, className = "" }) => {
  const generateRecentGrid = () => {
    const data = [];
    const today = new Date();
    const weeksToShow = 80; 
    const daysToShow = weeksToShow * 7;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateString = dateUtils.getDateStringIST(date);
      const isCompleted = completions?.includes(dateString) || false;

      data.push({
        date: dateString,
        completed: isCompleted,
        day: date.getDay(),
      });
    }

    return data;
  };

  const data = generateRecentGrid();

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className={`${className} w-full overflow-x-hidden`}>
      <div className="flex gap-1 justify-end">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                className={`
                  w-3 h-3 rounded-sm transition-colors duration-200
                  ${
                    day.completed
                      ? "bg-[#1995ad]"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }
                `}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: (weekIndex * 7 + dayIndex) * 0.002,
                  duration: 0.1,
                }}
                title={`${day.date} ${day.completed ? "✓" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributionGraph;
