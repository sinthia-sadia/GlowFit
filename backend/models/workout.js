const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutType: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  calories: {
    type: Number, // kcal
    required: true
  },
  date: {
    type: Date,
    default: Date.now // optional but useful
  }
});

module.exports = mongoose.model('Workout', workoutSchema);
