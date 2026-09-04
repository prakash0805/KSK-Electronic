const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    issue: {
      type: String,
      required: true,
      enum: [
        'Screen flickering',
        "No power / won't turn on",
        'No picture / half screen',
        'Lines or spots on screen',
        'Remote or connectivity issue',
        'Something else',
      ],
      default: 'Something else',
    },
    mode: {
      type: String,
      enum: ['Home visit', 'Bring to shop'],
      default: 'Home visit',
    },
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Scheduled', 'Completed', 'Cancelled'],
      default: 'New',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
