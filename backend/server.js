const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const bmiRoutes = require('./routes/bmiRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const sleepRoutes = require('./routes/sleepRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const stepRoutes = require('./routes/stepRoutes');



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/bmi', bmiRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/steps', stepRoutes);
app.use("/api/report", require("./routes/reportRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


