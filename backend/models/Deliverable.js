const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
  query: { type: mongoose.Schema.Types.ObjectId, ref: 'Query', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  files: [{ type: String }], 
  submittedAt: { type: Date, default: Date.now },
  message: { type: String },
});

module.exports = mongoose.model('Deliverable', deliverableSchema);
