const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // format: YYYY-MM-DD
  sleepTime: { type: String, required: true },
  wakeTime: { type: String, required: true }
});

module.exports = mongoose.model('Sleep', sleepSchema);
