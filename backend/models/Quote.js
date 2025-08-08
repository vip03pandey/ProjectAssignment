const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  query: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Query',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  breakdown: [
    {
      country: { type: String, required: true },
      hours: { type: Number, required: true },
      rate: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quote', quoteSchema);
