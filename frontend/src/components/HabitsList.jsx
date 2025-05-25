import React, { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import HabitCard from "./HabitCard";
import { habitService } from "../services/habitService";

const HabitsList = ({
  habits,
  onUpdateHabit,
  onReorderHabits,
  onDeleteHabit,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleReorder = async (newOrder) => {
    onReorderHabits(newOrder);

    try {
      const updatePromises = newOrder.map((habit, index) =>
        habitService.updateHabitOrder(habit.id, index)
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error reordering habits:", error);
    }
  };

  if (!habits || habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 sm:py-12 px-4"
      >
        <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
          No habits yet. Create your first habit to get started!
        </p>
      </motion.div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <HabitCard
              habit={habit}
              onUpdate={onUpdateHabit}
              onDelete={onDeleteHabit}
              index={index}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={habits}
      onReorder={handleReorder}
      className="space-y-4 sm:space-y-6"
    >
      {habits.map((habit, index) => (
        <Reorder.Item
          key={habit.id}
          value={habit}
          dragListener={true}
          dragControls={undefined}
          style={{
            position: "relative",
            listStyle: "none",
          }}
        >
          <div className="cursor-grab active:cursor-grabbing">
            <HabitCard
              habit={habit}
              onUpdate={onUpdateHabit}
              onDelete={onDeleteHabit}
              index={index}
            />
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default HabitsList;
