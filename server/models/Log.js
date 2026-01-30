const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    toolUsed: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    ip: { type: String },
    status: { type: String, default: 'success' },
    details: { type: String }
});

module.exports = mongoose.model('Log', logSchema);
