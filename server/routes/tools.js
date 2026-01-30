const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const Settings = require('../models/Settings');

router.get('/', async (req, res) => {
    try {
        const tools = await Tool.find({ enabled: true }).sort('order');
        res.json(tools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
