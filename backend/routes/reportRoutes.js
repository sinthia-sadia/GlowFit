// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Workout = require("../models/workout");
const Sleep = require("../models/Sleep");
const mongoose = require("mongoose");

function getDateRange(type) {
  const today = new Date();
  const start = new Date(today);
  if (type === "weekly") start.setDate(today.getDate() - 6);
  if (type === "monthly") start.setDate(today.getDate() - 29);
  start.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  return { start, end: today };
}

async function getWorkoutDays(userId, type) {
  const { start, end } = getDateRange(type);
  const workouts = await Workout.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  });

  const uniqueDays = new Set(workouts.map(w => w.createdAt.toDateString()));
  return uniqueDays.size;
}

async function getTotalCalories(userId, type) {
  const { start, end } = getDateRange(type);
  const workouts = await Workout.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  });

  return workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
}

async function getAvgSleep(userId, type) {
  const { start, end } = getDateRange(type);
  const sleeps = await Sleep.find({
    user: userId,
    date: { $gte: start, $lte: end },
  });

  if (sleeps.length === 0) return 0;

  const totalSleep = sleeps.reduce((sum, s) => sum + (s.duration || 0), 0);
  return +(totalSleep / sleeps.length).toFixed(2); // in hours
}



router.get("/summary/:type", protect, async (req, res) => {
  const type = req.params.type; // 'weekly' or 'monthly'
  const userId = req.user._id;

  try {
    const [workoutDays, calories, sleepHours] = await Promise.all([
      getWorkoutDays(userId, type),
      getTotalCalories(userId, type),
      getAvgSleep(userId, type),
      
    ]);

    return res.json({
      workoutDays,
      calories,
      sleep: sleepHours,
    });
  } catch (err) {
    console.error("Report summary error:", err);
    res.status(500).json({ message: "Error generating report" });
  }
});

module.exports = router;
