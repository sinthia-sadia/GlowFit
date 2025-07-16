const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Workout = require('../models/workout'); // make sure this path is correct

// POST /api/workout/complete
router.post('/complete', protect, async (req, res) => {
  try {
    const { workoutType, duration, calories } = req.body;

    if (!workoutType || !duration || !calories) {
      return res.status(400).json({ error: "Missing workout data" });
    }

    const workoutEntry = new Workout({
      userId: req.user._id,
      workoutType,
      duration,
      calories
    });

    await workoutEntry.save();

    res.status(200).json({ message: 'Workout saved successfully', workout: workoutEntry });
  } catch (err) {
    console.error('Workout save error:', err.message);
    res.status(500).json({ error: 'Server error while saving workout' });
  }
});
// GET /api/workouts — get all workouts for current user
router.get('/', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (err) {
    console.error("Workout fetch error:", err.message);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// GET /api/workout/weekly — Get workout summary for the current week
router.get('/weekly', protect, async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const workouts = await Workout.find({
      userId: req.user._id,
      date: { $gte: startOfWeek }
    });

    const caloriesPerDay = Array(7).fill(0); // Sunday to Saturday
    const durationPerDay = Array(7).fill(0);
 const Step = require('../models/step'); // make sure this path is correct

const stepsData = await Step.find({
  userId: req.user._id,
  date: { $gte: startOfWeek.toISOString().split('T')[0] }
});

const stepsPerDay = Array(7).fill(0);
stepsData.forEach(step => {
  const dayIndex = new Date(step.date).getDay();
  stepsPerDay[dayIndex] = step.steps;
});


    workouts.forEach(workout => {
      const day = new Date(workout.date).getDay(); // 0 = Sun, 6 = Sat
      caloriesPerDay[day] += workout.calories;
      durationPerDay[day] += workout.duration;
    });

    res.json({ caloriesPerDay, durationPerDay, stepsPerDay });
  } catch (err) {
    console.error("Weekly summary fetch error:", err.message);
    res.status(500).json({ error: 'Failed to fetch weekly workout summary' });
  }
});

module.exports = router;
