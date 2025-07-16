const express = require('express');
const Sleep = require('../models/Sleep');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/sleep - Save sleep data
router.post('/', protect, async (req, res) => {
  const { sleepTime, wakeTime } = req.body;

  const localDate = new Date();
  const offset = localDate.getTimezoneOffset() * 60000;
  const todayLocal = new Date(localDate - offset).toISOString().split('T')[0];

  try {
    const existing = await Sleep.findOne({ user: req.user._id, date: todayLocal });
    if (existing) {
      existing.sleepTime = sleepTime;
      existing.wakeTime = wakeTime;
      await existing.save();
      return res.json(existing);
    }

    const entry = new Sleep({
      user: req.user._id,
      date: todayLocal,
      sleepTime,
      wakeTime
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error('Sleep save error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/sleep/:date - Get sleep by date
router.get('/:date', protect, async (req, res) => {
  try {
    const data = await Sleep.findOne({ user: req.user._id, date: req.params.date });
    if (!data) return res.status(404).json({ message: 'No data' });
    res.json(data);
  } catch (err) {
    console.error('Fetch sleep error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
