const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  category: { type: String, default: 'PDF Tools' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Tool', toolSchema);
