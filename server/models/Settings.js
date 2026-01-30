const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'PDF Tools Hub' },
    maxFileSize: { type: Number, default: 10485760 }, // 10MB in bytes
    maintenanceMode: { type: Boolean, default: false },
    contactEmail: { type: String, default: 'admin@pdftoolshub.com' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
