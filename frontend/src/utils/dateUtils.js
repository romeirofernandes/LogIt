export const dateUtils = {
  getTodayIST() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().split("T")[0];
  },

  isTodayIST(dateString) {
    return dateString === this.getTodayIST();
  },

  getDateStringIST(date) {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(date.getTime() + istOffset);
    return istTime.toISOString().split("T")[0];
  },

  calculateStreak(completions) {
    if (!completions || completions.length === 0) return 0;

    const today = this.getTodayIST();
    const sortedDates = [...completions].sort().reverse();

    let streak = 0;
    let currentDate = today;

    for (const completion of sortedDates) {
      if (completion === currentDate) {
        streak++;
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        currentDate = this.getDateStringIST(prevDate);
      } else {
        break;
      }
    }

    return streak;
  },

  generateContributionData(completions, createdAt) {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    const habitCreated = createdAt?.toDate
      ? createdAt.toDate()
      : new Date(createdAt);
    const actualStartDate = startDate > habitCreated ? startDate : habitCreated;

    for (
      let d = new Date(actualStartDate);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const dateString = this.getDateStringIST(d);
      const isCompleted = completions.includes(dateString);

      data.push({
        date: dateString,
        completed: isCompleted,
        day: d.getDay(),
      });
    }

    return data;
  },

  calculateStreakAtDate(completions, targetDate) {
    if (!completions || completions.length === 0) return 0;

    const sortedCompletions = [...completions].sort();
    const target = new Date(targetDate);

    // Filter completions up to and including the target date
    const relevantCompletions = sortedCompletions.filter((completion) => {
      const compDate = new Date(completion);
      return compDate <= target;
    });

    if (relevantCompletions.length === 0) return 0;

    let streak = 0;
    const targetDateStr = this.getDateStringIST(target);

    // Start from target date and work backwards
    for (let i = 0; i <= 365; i++) {
      // Max 365 days back
      const checkDate = new Date(target);
      checkDate.setDate(target.getDate() - i);
      const checkDateStr = this.getDateStringIST(checkDate);

      if (relevantCompletions.includes(checkDateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },
};
