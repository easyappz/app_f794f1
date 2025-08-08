require('module-alias/register');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const requestLogger = require('@src/middlewares/requestLogger');
const errorHandler = require('@src/middlewares/errorHandler');
const apiRoutes = require('@src/routes/main');

const app = express();

// Basic middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestLogger);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not Found' } });
});

// Centralized error handler
app.use(errorHandler);

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
  }
}

connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
