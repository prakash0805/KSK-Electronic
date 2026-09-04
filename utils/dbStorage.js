const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Service = require('../models/Service');
const Enquiry = require('../models/Enquiry');

const DATA_DIR = path.join(__dirname, '../data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data for reviews
const initialReviews = [
  { _id: '1', name: 'Arun Kumar', rating: 5, text: 'Fixed my LED TV backlight issue same day, right at home. Fair pricing.', approved: true, createdAt: new Date().toISOString() },
  { _id: '2', name: 'Priya S', rating: 5, text: 'Very honest diagnosis — told me exactly what was wrong before charging anything.', approved: true, createdAt: new Date().toISOString() },
  { _id: '3', name: 'Mohamed Rafi', rating: 4, text: 'Good service, technician was on time and explained the repair clearly.', approved: true, createdAt: new Date().toISOString() },
];

// Initial seed data for services
const initialServices = [
  { icon: 'ic-power', title: 'TV Not Turning On' },
  { icon: 'ic-picture', title: 'No Display / Picture Problem' },
  { icon: 'ic-flicker', title: 'Screen Flickering Issue' },
  { icon: 'ic-lines', title: 'Screen Lines Issue' },
  { icon: 'ic-wifi', title: 'No Signal / Wi-Fi Problem' },
  { icon: 'ic-hdmi', title: 'HDMI / USB Problem' },
  { icon: 'ic-remote', title: 'Remote Control Issue' },
  { icon: 'ic-backlight', title: 'Backlight Bleeding' },
  { icon: 'ic-half', title: 'Half Screen Issue' },
  { icon: 'ic-net', title: 'Internet Connectivity' },
  { icon: 'ic-blur', title: 'Blur Screen Issue' },
  { icon: 'ic-chip', title: 'Chip Level Repair' },
  { icon: 'ic-software', title: 'Software & Firmware' },
  { icon: 'ic-glass', title: 'Toughened Glass Install' },
  { icon: 'ic-spot', title: 'White / Black Spot Issue' },
  { icon: 'ic-home', title: 'Home Visit Service' },
].map((s, i) => ({ ...s, _id: String(i + 1), order: i, active: true }));

// Helper to read JSON file
function readJson(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

// Helper to write JSON file
function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
}

// Seed JSON database files if not present
if (!fs.existsSync(REVIEWS_FILE)) writeJson(REVIEWS_FILE, initialReviews);
if (!fs.existsSync(SERVICES_FILE)) writeJson(SERVICES_FILE, initialServices);
if (!fs.existsSync(ENQUIRIES_FILE)) writeJson(ENQUIRIES_FILE, []);

module.exports = {
  // REVIEWS
  async getReviews() {
    if (mongoose.connection.readyState === 1) {
      try {
        const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
        return reviews;
      } catch (err) {
        console.warn('MongoDB query failed, using persistent JSON file:', err.message);
      }
    }
    return readJson(REVIEWS_FILE, initialReviews);
  },

  async addReview({ name, rating, text }) {
    if (mongoose.connection.readyState === 1) {
      try {
        const review = await Review.create({ name, rating, text });
        return review;
      } catch (err) {
        console.warn('MongoDB save failed, saving to persistent JSON file:', err.message);
      }
    }
    const reviews = readJson(REVIEWS_FILE, initialReviews);
    const newReview = {
      _id: String(Date.now()),
      name,
      rating: Number(rating),
      text,
      approved: true,
      createdAt: new Date().toISOString()
    };
    reviews.unshift(newReview);
    writeJson(REVIEWS_FILE, reviews);
    return newReview;
  },

  // SERVICES
  async getServices() {
    if (mongoose.connection.readyState === 1) {
      try {
        const services = await Service.find({ active: true }).sort({ order: 1 });
        return services;
      } catch (err) {
        console.warn('MongoDB query failed, using persistent JSON file:', err.message);
      }
    }
    return readJson(SERVICES_FILE, initialServices);
  },

  // ENQUIRIES
  async getEnquiries() {
    if (mongoose.connection.readyState === 1) {
      try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        return enquiries;
      } catch (err) {
        console.warn('MongoDB query failed, using persistent JSON file:', err.message);
      }
    }
    return readJson(ENQUIRIES_FILE, []);
  },

  async addEnquiry({ name, phone, issue, mode, notes }) {
    if (mongoose.connection.readyState === 1) {
      try {
        const enquiry = await Enquiry.create({ name, phone, issue, mode, notes });
        return enquiry;
      } catch (err) {
        console.warn('MongoDB save failed, saving to persistent JSON file:', err.message);
      }
    }
    const enquiries = readJson(ENQUIRIES_FILE, []);
    const newEnquiry = {
      _id: String(Date.now()),
      name,
      phone,
      issue,
      mode,
      notes: notes || '',
      status: 'New',
      createdAt: new Date().toISOString()
    };
    enquiries.unshift(newEnquiry);
    writeJson(ENQUIRIES_FILE, enquiries);
    return newEnquiry;
  },

  async updateEnquiryStatus(id, status) {
    if (mongoose.connection.readyState === 1) {
      try {
        const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (enquiry) return enquiry;
      } catch (err) {
        console.warn('MongoDB update failed, updating JSON file:', err.message);
      }
    }
    const enquiries = readJson(ENQUIRIES_FILE, []);
    const item = enquiries.find(e => e._id === id);
    if (item) {
      item.status = status;
      writeJson(ENQUIRIES_FILE, enquiries);
      return item;
    }
    return null;
  },

  async deleteEnquiry(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        const deleted = await Enquiry.findByIdAndDelete(id);
        if (deleted) return true;
      } catch (err) {
        console.warn('MongoDB delete failed, deleting from JSON file:', err.message);
      }
    }
    const enquiries = readJson(ENQUIRIES_FILE, []);
    const idx = enquiries.findIndex(e => e._id === id);
    if (idx !== -1) {
      enquiries.splice(idx, 1);
      writeJson(ENQUIRIES_FILE, enquiries);
      return true;
    }
    return false;
  }
};
