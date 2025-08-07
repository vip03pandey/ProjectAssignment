const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  query: { type: mongoose.Schema.Types.ObjectId, ref: 'Query', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  breakdown: [
    {
      country: String,
      hours: Number,
      rate: Number,
      total: Number,
    }
  ],
  total: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quote', quoteSchema);
