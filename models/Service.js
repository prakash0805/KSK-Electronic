const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
