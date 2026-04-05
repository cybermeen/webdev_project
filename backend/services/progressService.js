const db = require('../db/db');

const ProgressService = {
  // Calculate daily completion percentage
  async calculateDailyProgress(userId, date = new Date()) {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
      FROM tasks
      WHERE user_id = $1 
        AND DATE(due_date) = $2
    `;
    
    const result = await db.query(query, [userId, dateStr]);
    const { total_tasks, completed_tasks } = result.rows[0];
    
    const completionPercentage = total_tasks > 0 
      ? Math.round((completed_tasks / total_tasks) * 100) 
      : 0;
    
    // Save to daily_progress table
    await db.query(`
      INSERT INTO daily_progress (user_id, date, total_tasks, completed_tasks, completion_percentage)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, date) DO UPDATE SET
        total_tasks = $3,
        completed_tasks = $4,
        completion_percentage = $5,
        created_at = CURRENT_TIMESTAMP
    `, [userId, dateStr, total_tasks, completed_tasks, completionPercentage]);
    
    return {
      date: dateStr,
      total_tasks,
      completed_tasks,
      completionPercentage
    };
  },

  // Calculate streak (consecutive days with 100% completion)
  async calculateStreak(userId) {
    const query = `
      SELECT 
        date,
        completion_percentage
      FROM daily_progress
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT 365
    `;
    
    const result = await db.query(query, [userId]);
    const dailyData = result.rows;
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastCompletedDate = null;
    
    // Check from most recent date backwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < dailyData.length; i++) {
      const record = dailyData[i];
      
      // Only count days with 100% completion
      if (record.completion_percentage === 100) {
        tempStreak++;
        if (i === 0) {
          // Most recent record
          const recordDate = new Date(record.date);
          const dayDiff = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
          
          // Only count if it's today or yesterday
          if (dayDiff <= 1) {
            currentStreak = tempStreak;
            lastCompletedDate = record.date;
          }
        }
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }
    
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    
    // Update streaks table
    await db.query(`
      INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_completed_date, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        current_streak = $2,
        longest_streak = $3,
        last_completed_date = $4,
        updated_at = CURRENT_TIMESTAMP
    `, [userId, currentStreak, longestStreak, lastCompletedDate]);
    
    return {
      currentStreak,
      longestStreak,
      lastCompletedDate
    };
  },

  // Get dashboard stats (all progress data)
  async getDashboardStats(userId) {
    // Get today's progress
    const todayProgress = await this.calculateDailyProgress(userId);
    
    // Get streak info
    const streakInfo = await this.calculateStreak(userId);
    
    // Get last 7 days progress (for chart)
    const sevenDaysQuery = `
      SELECT 
        date,
        completion_percentage,
        completed_tasks,
        total_tasks
      FROM daily_progress
      WHERE user_id = $1
        AND date >= CURRENT_DATE - INTERVAL '6 days'
      ORDER BY date ASC
    `;
    
    const sevenDaysResult = await db.query(sevenDaysQuery, [userId]);
    
    // Get overall stats
    const overallQuery = `
      SELECT 
        COUNT(DISTINCT DATE(due_date)) as total_days_with_tasks,
        ROUND(AVG(completion_percentage)::numeric, 2) as average_completion,
        MAX(completion_percentage) as best_day
      FROM daily_progress
      WHERE user_id = $1
    `;
    
    const overallResult = await db.query(overallQuery, [userId]);
    const { total_days_with_tasks, average_completion, best_day } = overallResult.rows[0];
    
    return {
      today: todayProgress,
      streak: streakInfo,
      last7Days: sevenDaysResult.rows,
      overall: {
        totalDaysWithTasks: total_days_with_tasks || 0,
        averageCompletion: average_completion || 0,
        bestDay: best_day || 0
      }
    };
  },

  // Get detailed history (with filters)
  async getProgressHistory(userId, limit = 30) {
    const query = `
      SELECT 
        date,
        total_tasks,
        completed_tasks,
        completion_percentage
      FROM daily_progress
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT $2
    `;
    
    const result = await db.query(query, [userId, limit]);
    return result.rows;
  }
};

module.exports = ProgressService;

