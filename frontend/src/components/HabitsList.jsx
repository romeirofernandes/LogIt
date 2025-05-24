import React from "react";
import { motion, Reorder } from "framer-motion";
import HabitCard from "./HabitCard";
import { habitService } from "../services/habitService";

const HabitsList = ({ habits, onUpdateHabit, onReorderHabits, onDeleteHabit }) => {
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
        className="text-center py-12"
      >
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          No habits yet. Create your first habit to get started!
        </p>
      </motion.div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={habits}
      onReorder={handleReorder}
      className="space-y-6"
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
