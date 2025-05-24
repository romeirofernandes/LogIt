import React from 'react';
import { motion, Reorder } from 'framer-motion';
import HabitCard from './HabitCard';
import { habitService } from '../services/habitService';

const HabitsList = ({ habits, onUpdateHabit, onReorderHabits }) => {
  const handleReorder = async (newOrder) => {
    // Update local state immediately for smooth UX
    onReorderHabits(newOrder);
    
    // Update order in Firestore
    try {
      const updatePromises = newOrder.map((habit, index) => 
        habitService.updateHabitOrder(habit.id, index)
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error reordering habits:', error);
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
      className="space-y-4"
    >
      {habits.map((habit, index) => (
        <Reorder.Item 
          key={habit.id} 
          value={habit}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
        >
          <HabitCard 
            habit={habit} 
            onUpdate={onUpdateHabit}
            index={index}
          />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default HabitsList;