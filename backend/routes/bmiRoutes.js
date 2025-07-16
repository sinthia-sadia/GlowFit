const express = require('express');
const router = express.Router();
const BMI = require('../models/BMI'); // BMI model
const protect = require('../middleware/authMiddleware');

// Save BMI result
router.post('/add',protect, async (req, res) => {
  try {
    const { gender, height, weight, bmi, category } = req.body;
    const newBMI = new BMI({
  user: req.user._id,
  gender,
  height,
  weight,
  bmi,
  category
});
    await newBMI.save();
    res.status(201).json({ message: 'BMI saved', bmi: newBMI });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save BMI', error: err.message });
  }
});

router.get('/history', protect, async (req, res) => {
  try {
const records = await BMI.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch BMI history' });
  }
});

module.exports = router;
