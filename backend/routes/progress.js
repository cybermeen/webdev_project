const express = require('express');
const router = express.Router();
const ProgressService = require('../services/progressService');
const auth = require('../auth/auth');

// Apply auth middleware
router.use(auth);

// GET dashboard stats (today, streak, last 7 days, overall)
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.session.userId;
    const stats = await ProgressService.getDashboardStats(userId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET progress history
router.get('/history', async (req, res) => {
  try {
    const userId = req.session.userId;
    const limit = req.query.limit || 30;
    const history = await ProgressService.getProgressHistory(userId, limit);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET today's progress
router.get('/today', async (req, res) => {
  try {
    const userId = req.session.userId;
    const today = await ProgressService.calculateDailyProgress(userId);
    res.json(today);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET streak info
router.get('/streak', async (req, res) => {
  try {
    const userId = req.session.userId;
    const streak = await ProgressService.calculateStreak(userId);
    res.json(streak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;