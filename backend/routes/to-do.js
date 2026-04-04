const express = require('express');
const router = express.Router();
const ToDoService = require('../services/to-doService');
const auth = require('../auth/auth'); // Your Gatekeeper middleware

// Apply 'auth' middleware to all routes below
router.use(auth);

// GET all tasks (categorized)
router.get('/', async (req, res) => {
  try {
    // We pull the ID from the session established during login
    const userId = req.session.userId;
    const tasks = await ToDoService.getCategorizedTasks(userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    // We pass req.session.userId separately to ensure it's secure
    const newTask = await ToDoService.createTask(req.body, req.session.userId);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    // Use req.session.userId instead of req.body.user_id
    const updated = await ToDoService.toggleTaskStatus(req.params.id, req.session.userId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    // Use req.session.userId instead of req.body.user_id
    const response = await ToDoService.deleteTask(req.params.id, req.session.userId);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;