const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// REGISTER
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password, localDate } = req.body; // ⬅️ receive local date from frontend


  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    if (!Array.isArray(user.loginHistory)) {
      user.loginHistory = [];
    }

    if (!user.loginHistory.includes(localDate)) {
      user.loginHistory.push(localDate);
      user.markModified('loginHistory');
      await user.save();
      console.log(`✅ Login date ${localDate} saved for ${user.email}`);
    } else {
      console.log(`ℹ️ Date ${localDate} already exists for ${user.email}`);
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET PROFILE
router.get('/profile', protect, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      name: user.name,
      email: user.email,
      username: user.username,
      age: user.age,
      height: user.height,
      weight: user.weight,
      goal: user.goal,
      activity: user.activity,
    });
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE PROFILE
router.put('/profile', protect, async (req, res) => {
  const { name, username, email, age, height, weight, goal, activity } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.age = age || user.age;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.goal = goal || user.goal;
    user.activity = activity || user.activity;

    const updatedUser = await user.save();

    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      age: updatedUser.age,
      height: updatedUser.height,
      weight: updatedUser.weight,
      goal: updatedUser.goal,
      activity: updatedUser.activity,
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN STATS
router.get('/login-stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !Array.isArray(user.loginHistory)) {
      return res.status(404).json({ error: 'User not found or no login history' });
    }

    // Sort login history in descending order (latest first)
    const sortedDates = user.loginHistory
      .map(d => d.trim()) // clean up
      .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)) // only valid dates
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(today.getDate() - streak);
      const expectedStr = expectedDate.toISOString().split('T')[0];

      if (sortedDates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ loginHistory: user.loginHistory, streak });
  } catch (err) {
    console.error('Login stats error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
