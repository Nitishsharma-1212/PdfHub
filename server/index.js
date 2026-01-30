const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs-extra');

const authRoutes = require('./routes/auth');
const toolRoutes = require('./routes/tools');
const adminRoutes = require('./routes/admin');
const pdfRoutes = require('./routes/pdf');

const Tool = require('./models/Tool');
const Settings = require('./models/Settings');
const Admin = require('./models/Admin');

const app = express();
let dbConnectionError = null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        error: dbConnectionError ? dbConnectionError.message : null,
        env: {
            mongoUriConfigured: !!process.env.MONGODB_URI,
            port: process.env.PORT
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pdf', pdfRoutes);

// Database Connection
console.log('Attempting to connect to MongoDB...');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://redhume:hkBF2wsTL8665@cluster0.2aund0h.mongodb.net/pdftoolshub';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        dbConnectionError = null;
        await seedDatabase();
    })
    .catch(err => {
        console.error('Could not connect to MongoDB', err);
        dbConnectionError = err;
    });

async function seedDatabase() {
    // Seed Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
        await Settings.create({});
        console.log('Default settings created');
    }

    // Seed Tools
    // Seed Tools (or update if missing)
    const existingTools = await Tool.find();
    const defaultTools = [
        { name: 'Merge PDF', slug: 'merge-pdf', icon: 'Merge', description: 'Combine multiple PDFs into one document.', order: 1 },
        { name: 'Split PDF', slug: 'split-pdf', icon: 'Scissors', description: 'Extract pages from your PDF or save each page as a separate PDF.', order: 2 },
        { name: 'Compress PDF', slug: 'compress-pdf', icon: 'Minimize', description: 'Reduce the file size of your PDF while optimizing for maximal PDF quality.', order: 3 },
        { name: 'Image to PDF', slug: 'img-to-pdf', icon: 'Image', description: 'Convert JPG and PNG images into a PDF document instantly.', order: 4 },
        { name: 'PDF to Word', slug: 'pdf-to-word', icon: 'FileText', description: 'Convert your PDF to WORD documents with incredible accuracy.', order: 5 },
        { name: 'PDF to PowerPoint', slug: 'pdf-to-ppt', icon: 'Presentation', description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', order: 6 },
        { name: 'PDF to Excel', slug: 'pdf-to-excel', icon: 'Sheet', description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', order: 7 },
        { name: 'Excel to PDF', slug: 'excel-to-pdf', icon: 'FileSpreadsheet', description: 'Convert Excel spreadsheets to PDF.', order: 8 },
        { name: 'Edit PDF', slug: 'edit-pdf', icon: 'PenTool', description: 'Add text, shapes, images and freehand annotations to your PDF.', order: 9 },
        { name: 'PDF to JPG', slug: 'pdf-to-jpg', icon: 'Image', description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', order: 10 },
        { name: 'Unlock PDF', slug: 'unlock-pdf', icon: 'Unlock', description: 'Remove PDF password security, giving you the freedom to use your data as you want.', order: 11 },
        { name: 'Protect PDF', slug: 'protect-pdf', icon: 'Lock', description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.', order: 12 }
    ];

    for (const tool of defaultTools) {
        if (!existingTools.find(t => t.slug === tool.slug)) {
            await Tool.create(tool);
            console.log(`Seeded tool: ${tool.name}`);
        }
    }

    // Seed Admin (if doesn't exist)
    // Seed Admin (force update/create)
    let admin = await Admin.findOne({ role: 'admin' });
    if (!admin) {
        await Admin.create({
            email: 'hkBF2wsTL8665',
            password: 'hkBF2wsTL8665',
            role: 'admin'
        });
        console.log('Admin created: hkBF2wsTL8665 / hkBF2wsTL8665');
    } else {
        admin.email = 'hkBF2wsTL8665';
        admin.password = 'hkBF2wsTL8665';
        await admin.save();
        console.log('Admin updated: hkBF2wsTL8665 / hkBF2wsTL8665');
    }
}

// Ensure upload directories exist
fs.ensureDirSync(path.join(__dirname, 'uploads'));
fs.ensureDirSync(path.join(__dirname, 'temp'));

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
