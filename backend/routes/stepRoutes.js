const express = require('express');
const router = express.Router();
const Step = require('../models/step');
const protect = require('../middleware/authMiddleware');

// POST /api/steps — save today's steps
router.post('/', protect, async (req, res) => {
  try {
    const { steps } = req.body;
    if (!steps) return res.status(400).json({ error: 'Steps required' });

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);

    let existing = await Step.findOne({ userId: req.user._id, date: localDate });

    if (existing) {
      existing.steps = steps;
      await existing.save();
      return res.json({ message: 'Steps updated', data: existing });
    }

    const newStep = new Step({
      userId: req.user._id,
      steps,
      date: localDate
    });

    await newStep.save();
    res.status(201).json({ message: 'Steps saved', data: newStep });
  } catch (err) {
    console.error('Step save error:', err.message);
    res.status(500).json({ error: 'Server error saving steps' });
  }
});

// GET /api/steps/weekly — get last 7 days' steps
router.get('/weekly', protect, async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    const formattedStart = new Date(start.getTime() - start.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);

    const steps = await Step.find({
      userId: req.user._id,
      date: { $gte: formattedStart }
    });

    const stepsMap = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      stepsMap[key] = 0;
    }

    steps.forEach(entry => {
      stepsMap[entry.date] = entry.steps;
    });

    const stepsPerDay = Object.values(stepsMap);

    res.json({ stepsPerDay });
  } catch (err) {
    console.error('Weekly steps fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch steps' });
  }
});

module.exports = router;
