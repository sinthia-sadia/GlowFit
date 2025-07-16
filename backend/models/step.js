const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  steps: {
    type: Number,
    required: true
  },
  date: {
    type: String, // Local date as 'YYYY-MM-DD'
    required: true
  }
});

module.exports = mongoose.model('Step', stepSchema);
