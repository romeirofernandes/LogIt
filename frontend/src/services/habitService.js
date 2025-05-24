import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc, // Add this import
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const habitService = {
  // Create a new habit
  async createHabit(userId, habitData) {
    try {
      const docRef = await addDoc(collection(db, "habits"), {
        userId,
        name: habitData.name,
        description: habitData.description,
        createdAt: serverTimestamp(),
        completions: [], // Array of completion dates
        currentStreak: 0,
        longestStreak: 0,
        order: Date.now(), // For reordering
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating habit:", error);
      throw error;
    }
  },

  // Get all habits for a user (temporarily without ordering)
  async getUserHabits(userId) {
    try {
      const q = query(
        collection(db, "habits"),
        where("userId", "==", userId)
        // Removed orderBy temporarily
      );
      const querySnapshot = await getDocs(q);
      const habits = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort on client side for now
      return habits.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error("Error fetching habits:", error);
      throw error;
    }
  },

  // Complete a habit for today
  async completeHabit(habitId, completion) {
    try {
      const habitRef = doc(db, "habits", habitId);
      await updateDoc(habitRef, {
        completions: completion.completions,
        currentStreak: completion.currentStreak,
        longestStreak: completion.longestStreak,
      });
    } catch (error) {
      console.error("Error completing habit:", error);
      throw error;
    }
  },

  // Update habit order (for reordering)
  async updateHabitOrder(habitId, newOrder) {
    try {
      const habitRef = doc(db, "habits", habitId);
      await updateDoc(habitRef, { order: newOrder });
    } catch (error) {
      console.error("Error updating habit order:", error);
      throw error;
    }
  },

  async deleteHabit(habitId) {
    try {
      const habitRef = doc(db, "habits", habitId);
      await deleteDoc(habitRef);
    } catch (error) {
      console.error("Error deleting habit:", error);
      throw error;
    }
  },
};
