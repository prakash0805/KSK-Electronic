require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const enquiryRoutes = require('./routes/enquiries');
const serviceRoutes = require('./routes/services');
const reviewRoutes = require('./routes/reviews');

const app = express();

mongoose.set('bufferCommands', false);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serves the KSK Electronics website

// API routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ ok: true, service: 'KSK Electronics API', dbStatus: dbState, time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ksk_electronics';

app.listen(PORT, () => {
  console.log(`✔ KSK Electronics server running at http://localhost:${PORT}`);
});

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✔ MongoDB connected'))
  .catch((err) => console.warn('⚠ MongoDB connection warning (running in standalone mode without DB):', err.message));

