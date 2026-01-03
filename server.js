require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinical_observer';

// Middleware
app.use(cors()); // Allow frontend access
app.use(express.json());

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('[DATABASE] Connected to MongoDB Cluster'))
  .catch(err => console.error('[DATABASE] Connection Failure:', err));

// Schema Definition
const SubjectSchema = new mongoose.Schema({
  fingerprint: { type: String, required: true, unique: true, index: true },
  network: {
    ip: String,
    city: String,
    country: String,
    isp: String,
    asn: String
  },
  hardware: {
    gpu: String,
    model: String,
    platform: String,
    screenRes: String
  },
  visitCount: { type: Number, default: 0 },
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  logs: [{
    timestamp: { type: Date, default: Date.now },
    event: String
  }]
});

const Subject = mongoose.model('Subject', SubjectSchema);

// API Routes
app.post('/api/telemetry', async (req, res) => {
  try {
    const { fingerprint, network, hardware } = req.body;

    if (!fingerprint) {
      return res.status(400).json({ error: "Identity Hash Required" });
    }

    // Upsert: Find and update, or create if new. Increment visitCount.
    const subject = await Subject.findOneAndUpdate(
      { fingerprint: fingerprint },
      {
        $set: { 
          network, 
          hardware, 
          lastSeen: new Date() 
        },
        $inc: { visitCount: 1 },
        $setOnInsert: { firstSeen: new Date() }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`[TELEMETRY] Handshake: ${fingerprint} | Visit #${subject.visitCount}`);

    res.status(200).json({
      success: true,
      visitCount: subject.visitCount,
      id: subject._id
    });

  } catch (error) {
    console.error('[ERROR] Telemetry Sync Failed:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[SYSTEM] Clinical Observer Backend Active on Port ${PORT}`);
});