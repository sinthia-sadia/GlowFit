const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  breakfast: {
    type: [String],
    default: []
  },
  lunch: {
    type: [String],
    default: []
  },
  dinner: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', NutritionSchema);
