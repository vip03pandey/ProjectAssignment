const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  title: { type: String, required: true },
  regulatoryArea: { type: String },
  priority: { type: String },
  deadline: { type: Date },
  context: { type: String },
  questions: [{ type: String }],
  attachments: [{ type: String }],
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['New', 'Quoted', 'Approved', 'Submitted', 'Closed'],
    default: 'New',
  },
  approvedProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Query', querySchema);