export const dateUtils = {
  getTodayIST() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().split('T')[0]; 
  },

  isTodayIST(dateString) {
    return dateString === this.getTodayIST();
  },

  getDateStringIST(date) {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(date.getTime() + istOffset);
    return istTime.toISOString().split('T')[0];
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
    const habitCreated = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    const actualStartDate = startDate > habitCreated ? startDate : habitCreated;
    
    for (let d = new Date(actualStartDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateString = this.getDateStringIST(d);
      const isCompleted = completions.includes(dateString);
      
      data.push({
        date: dateString,
        completed: isCompleted,
        day: d.getDay(),
      });
    }
    
    return data;
  }
};