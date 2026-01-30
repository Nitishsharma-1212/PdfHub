const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const Settings = require('../models/Settings');

router.get('/', async (req, res) => {
    try {
        let tools = await Tool.find({ enabled: true }).sort('order');

        if (tools.length === 0) {
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
            await Tool.insertMany(defaultTools);
            tools = await Tool.find({ enabled: true }).sort('order');
        }

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
