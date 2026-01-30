const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const Tool = require('../models/Tool');
const Settings = require('../models/Settings');
const Log = require('../models/Log');

// Get all tools
router.get('/tools', checkAuth, async (req, res) => {
    try {
        const tools = await Tool.find().sort('order');
        res.json(tools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update tool
router.put('/tools/:id', checkAuth, async (req, res) => {
    try {
        const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tool);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get settings
router.get('/settings', checkAuth, async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update settings
router.put('/settings', checkAuth, async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get logs
router.get('/logs', checkAuth, async (req, res) => {
    try {
        const logs = await Log.find().sort('-timestamp').limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
