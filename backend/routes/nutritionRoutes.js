const express = require('express');
const router = express.Router();
const Nutrition = require('../models/Nutrition');
const protect = require('../middleware/authMiddleware');

// Helper to get today's date in local time (YYYY-MM-DD)
function getTodayLocalDate() {
  return new Date().toLocaleDateString('sv-SE'); // sv-SE gives YYYY-MM-DD
}

// Get today’s nutrition data
router.get('/', protect, async (req, res) => {
  const today = getTodayLocalDate();

  try {
    let entry = await Nutrition.findOne({ user: req.user._id, date: today });

    if (!entry) {
      entry = new Nutrition({ user: req.user._id, date: today });
      await entry.save();
    }

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update meal (breakfast/lunch/dinner)
router.post('/:meal', protect, async (req, res) => {
  const { meal } = req.params;
  const { item } = req.body;
  const today = getTodayLocalDate();

  if (!['breakfast', 'lunch', 'dinner'].includes(meal)) {
    return res.status(400).json({ error: 'Invalid meal type' });
  }

  try {
    let entry = await Nutrition.findOne({ user: req.user._id, date: today });

    if (!entry) {
      entry = new Nutrition({ user: req.user._id, date: today });
    }

    entry[meal].push(item);
    await entry.save();

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear meal
router.delete('/:meal', protect, async (req, res) => {
  const { meal } = req.params;
  const today = getTodayLocalDate();

  if (!['breakfast', 'lunch', 'dinner'].includes(meal)) {
    return res.status(400).json({ error: 'Invalid meal type' });
  }

  try {
    let entry = await Nutrition.findOne({ user: req.user._id, date: today });

    if (!entry) {
      return res.status(404).json({ error: 'No entry to clear' });
    }

    entry[meal] = [];
    await entry.save();

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nutrition by specific date (history view)
router.get('/history/:date', protect, async (req, res) => {
  try {
    const entry = await Nutrition.findOne({ user: req.user._id, date: req.params.date });
    if (!entry) {
      return res.json({});
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
