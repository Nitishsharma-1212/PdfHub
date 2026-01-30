const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Auth failed' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Auth failed' });
        }

        const token = jwt.sign(
            { email: admin.email, adminId: admin._id },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token: token,
            expiresIn: 3600,
            adminId: admin._id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
