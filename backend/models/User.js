const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },


  // Additional Profile Fields (optional)
  username: {
    type: String,
    trim: true
  },
  age: {
    type: Number
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  goal: {
    type: String,
    enum: ['Maintain Weight', 'Lose Weight', 'Gain Muscle'],
    default: 'Maintain Weight'
  },
  activity: {
    type: String,
    enum: ['Sedentary', 'Moderately Active', 'Very Active'],
    default: 'Moderately Active'
  },

  // tracking login dates
  loginHistory: {
    type: [String], 
    default: []
  },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
