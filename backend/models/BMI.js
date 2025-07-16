const mongoose = require('mongoose');

const bmiSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gender: String,
  height: Number,
  weight: Number,
  bmi: Number,
  category: String,
}, { timestamps: true });

module.exports = mongoose.model('BMI', bmiSchema);
