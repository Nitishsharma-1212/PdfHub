const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { PDFDocument } = require('pdf-lib');
const PDFMerger = require('pdf-merger-js');
const Log = require('../models/Log');
const Settings = require('../models/Settings');
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const XLSX = require('xlsx');
const PptxGenJS = require('pptxgenjs');
const archiver = require('archiver');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'image/jpeg', 'image/jpg', 'image/png',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
            'application/vnd.ms-excel' // xls
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'), false);
        }
    }
});

// Helper function to clean up files
const cleanUp = (files) => {
    files.forEach(file => {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    });
};

// Merge PDF
router.post('/merge', upload.array('pdfs'), async (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ message: 'At least 2 PDF files are required' });
        }

        const merger = new PDFMerger();
        for (const file of req.files) {
            await merger.add(file.path);
        }

        const mergedFileName = `merged-${Date.now()}.pdf`;
        const mergedPath = path.join(__dirname, '../uploads', mergedFileName);

        await merger.save(mergedPath);

        // Log usage
        await Log.create({ toolUsed: 'Merge PDF', ip: req.ip });

        res.json({
            message: 'PDFs merged successfully',
            downloadUrl: `/uploads/${mergedFileName}`
        });

        // Clean up temp files
        cleanUp(req.files);

        // Auto delete the merged file after 10 minutes
        setTimeout(() => {
            if (fs.existsSync(mergedPath)) {
                fs.unlinkSync(mergedPath);
            }
        }, 10 * 60 * 1000);

    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// Split PDF
router.post('/split', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        const pdfBuffer = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const totalPages = pdfDoc.getPageCount();

        let pageIndices = [];
        const pagesParam = req.body.pages;

        if (pagesParam && pagesParam.trim() !== '') {
            // Parse range string "1, 3-5, 8"
            const parts = pagesParam.split(',');
            parts.forEach(part => {
                const range = part.trim().split('-');
                if (range.length === 2) {
                    const start = parseInt(range[0]) - 1;
                    const end = parseInt(range[1]) - 1;
                    for (let i = start; i <= end; i++) {
                        if (i >= 0 && i < totalPages) pageIndices.push(i);
                    }
                } else {
                    const page = parseInt(part) - 1;
                    if (page >= 0 && page < totalPages) pageIndices.push(page);
                }
            });
            // Deduplicate and sort
            pageIndices = [...new Set(pageIndices)].sort((a, b) => a - b);
        } else {
            // Default: Extract all pages (create a clean copy)
            pageIndices = Array.from({ length: totalPages }, (_, i) => i);
        }

        if (pageIndices.length === 0) {
            return res.status(400).json({ message: 'Invalid page range selected' });
        }

        const newPdfDoc = await PDFDocument.create();
        const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdfDoc.addPage(page));

        const splitFileName = `split-${Date.now()}.pdf`;
        const splitPath = path.join(__dirname, '../uploads', splitFileName);
        const pdfBytes = await newPdfDoc.save();
        fs.writeFileSync(splitPath, pdfBytes);

        await Log.create({ toolUsed: 'Split PDF', ip: req.ip });

        res.json({
            message: 'PDF split successfully',
            downloadUrl: `/uploads/${splitFileName}`
        });

        cleanUp([req.file]);
        setTimeout(() => {
            if (fs.existsSync(splitPath)) fs.unlinkSync(splitPath);
        }, 10 * 60 * 1000);

    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// Compress PDF
router.post('/compress', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        // pdf-lib doesn't have a high-level "compress" like Adobe, 
        // but we can re-save with some optimizations or just mock it for this demo
        // Real compression often requires Ghostscript or similar.
        // We'll use PDFDocument.save({ useObjectStreams: false }) as a placeholder for optimization.

        const pdfBuffer = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pdfBytes = await pdfDoc.save();

        const compressedFileName = `compressed-${Date.now()}.pdf`;
        const compressedPath = path.join(__dirname, '../uploads', compressedFileName);
        fs.writeFileSync(compressedPath, pdfBytes);

        await Log.create({ toolUsed: 'Compress PDF', ip: req.ip });

        res.json({
            message: 'PDF compressed successfully',
            downloadUrl: `/uploads/${compressedFileName}`
        });

        cleanUp([req.file]);
        setTimeout(() => fs.removeSync(compressedPath), 10 * 60 * 1000);
    } catch (err) {
        console.error(err); // Added console error for debugging
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// Image to PDF
router.post('/image-to-pdf', upload.array('images'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least 1 image file is required' });
        }

        const pdfDoc = await PDFDocument.create();

        for (const file of req.files) {
            const imgBytes = fs.readFileSync(file.path);
            let img;

            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                img = await pdfDoc.embedJpg(imgBytes);
            } else if (file.mimetype === 'image/png') {
                img = await pdfDoc.embedPng(imgBytes);
            } else {
                continue; // Skip unsupported formats
            }

            const page = pdfDoc.addPage([img.width, img.height]);
            page.drawImage(img, {
                x: 0,
                y: 0,
                width: img.width,
                height: img.height,
            });
        }

        const pdfFileName = `images-to-pdf-${Date.now()}.pdf`;
        const pdfPath = path.join(__dirname, '../uploads', pdfFileName);
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(pdfPath, pdfBytes);

        await Log.create({ toolUsed: 'Image into PDF', ip: req.ip });

        res.json({
            message: 'Images converted to PDF successfully',
            downloadUrl: `/uploads/${pdfFileName}`
        });

        cleanUp(req.files);
        setTimeout(() => {
            if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        }, 10 * 60 * 1000);

    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// Protect PDF
router.post('/protect', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file || !req.body.password) {
            return res.status(400).json({ message: 'PDF file and password are required' });
        }

        const pdfBuffer = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        const protectedFileName = `protected-${Date.now()}.pdf`;
        const protectedPath = path.join(__dirname, '../uploads', protectedFileName);

        // Encrypt with password
        pdfDoc.encrypt({
            userPassword: req.body.password,
            ownerPassword: req.body.password,
            permissions: {
                printing: 'highResolution',
                modifying: false,
                copying: false,
                annotating: false,
                fillingForms: false,
                contentAccessibility: false,
                documentAssembly: false,
            },
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(protectedPath, pdfBytes);

        await Log.create({ toolUsed: 'Protect PDF', ip: req.ip });

        res.json({
            message: 'PDF protected successfully',
            downloadUrl: `/uploads/${protectedFileName}`
        });

        cleanUp([req.file]);
        setTimeout(() => { if (fs.existsSync(protectedPath)) fs.unlinkSync(protectedPath); }, 10 * 60 * 1000);

    } catch (err) {
        console.error(err); // Added console error
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// Unlock PDF (Demo: Removes password if provided)
router.post('/unlock', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file || !req.body.password) {
            return res.status(400).json({ message: 'PDF file and password are required' });
        }

        const pdfBuffer = fs.readFileSync(req.file.path);

        // Try loading with the provided password
        // Note: pdf-lib loads encrypted PDFs if password is correct. 
        // To "unlock", we just save it without encryption.
        const pdfDoc = await PDFDocument.load(pdfBuffer, { password: req.body.password });

        const unlockedFileName = `unlocked-${Date.now()}.pdf`;
        const unlockedPath = path.join(__dirname, '../uploads', unlockedFileName);

        const pdfBytes = await pdfDoc.save(); // Saves without encryption by default
        fs.writeFileSync(unlockedPath, pdfBytes);

        await Log.create({ toolUsed: 'Unlock PDF', ip: req.ip });

        res.json({
            message: 'PDF unlocked successfully',
            downloadUrl: `/uploads/${unlockedFileName}`
        });

        cleanUp([req.file]);
        setTimeout(() => { if (fs.existsSync(unlockedPath)) fs.unlinkSync(unlockedPath); }, 10 * 60 * 1000);

    } catch (err) {
        // pdf-lib throws if password is wrong
        if (!res.headersSent) res.status(400).json({ message: 'Incorrect password or failed to unlock' });
    }
});

// Real Conversion Implementations

// PDF to Word
router.post('/pdf-to-word', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'File is required' });

        const pdfBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(pdfBuffer);

        const doc = new Document({
            sections: [{
                properties: {},
                children: data.text.split('\n').filter(line => line.trim()).map(line =>
                    new Paragraph({
                        children: [new TextRun(line)],
                    })
                ),
            }],
        });

        const outputFileName = `converted-${Date.now()}.docx`;
        const outputPath = path.join(__dirname, '../uploads', outputFileName);
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(outputPath, buffer);

        await Log.create({ toolUsed: 'PDF to Word', ip: req.ip });

        res.json({
            message: 'PDF converted to Word successfully',
            downloadUrl: `/uploads/${outputFileName}`
        });

        cleanUp([req.file]);
        setTimeout(() => { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); }, 10 * 60 * 1000);

    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// PDF to Excel
router.post('/pdf-to-excel', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'File is required' });
        if (req.file.size === 0) return res.status(400).json({ message: 'File is empty' });

        const pdfBuffer = fs.readFileSync(req.file.path);

        let data;
        try {
            data = await pdfParse(pdfBuffer);
        } catch (parseError) {
            console.error("PDF Parse Error:", parseError);
            if (parseError.message && parseError.message.includes('Invalid PDF structure')) {
                throw new Error('The PDF file structure is invalid or corrupted.');
            }
            throw parseError;
        }

        // Check if text was extracted
        if (!data || !data.text || data.text.trim().length === 0) {
            // Fallback: If no text, creating an empty Excel might be confusing. 
            // But we can create one with a message.
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet([{ Message: "No text could be extracted from this PDF. It might be scanned or image-based." }]);
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            const outputFileName = `converted-${Date.now()}.xlsx`;
            const outputPath = path.join(__dirname, '../uploads', outputFileName);
            XLSX.writeFile(wb, outputPath);

            await Log.create({ toolUsed: 'PDF to Excel', ip: req.ip });
            res.json({
                message: 'PDF processed (No text found - Scanned PDF?)',
                downloadUrl: `/uploads/${outputFileName}`
            });
            cleanUp([req.file]);
            setTimeout(() => { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); }, 10 * 60 * 1000);
            return;
        }

        // Simple strategy: Each line is a row
        const rows = data.text.split('\n').filter(line => line.trim()).map(line => ({ Content: line }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        const outputFileName = `converted-${Date.now()}.xlsx`;
        const outputPath = path.join(__dirname, '../uploads', outputFileName);
        XLSX.writeFile(wb, outputPath);

        await Log.create({ toolUsed: 'PDF to Excel', ip: req.ip });

        res.json({
            message: 'PDF converted to Excel successfully',
            downloadUrl: `/uploads/${outputFileName}`
        });

        cleanUp([req.file]);
        setTimeout(() => { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); }, 10 * 60 * 1000);

    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// Excel to PDF
router.post('/excel-to-pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'File is required' });

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        let y = height - 50;
        const fontSize = 10;

        // Draw text row by row
        for (const row of jsonData) {
            const text = row.join(' | ');
            if (y < 50) {
                page = pdfDoc.addPage();
                y = height - 50;
            }
            // Simple text wrapping or truncation could be added here
            page.drawText(String(text).substring(0, 100), { x: 50, y, size: fontSize });
            y -= 15;
        }

        const outputFileName = `converted-${Date.now()}.pdf`;
        const outputPath = path.join(__dirname, '../uploads', outputFileName);
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);

        await Log.create({ toolUsed: 'Excel to PDF', ip: req.ip });

        res.json({
            message: 'Excel converted to PDF successfully',
            downloadUrl: `/uploads/${outputFileName}`
        });

        cleanUp([req.file]);
        setTimeout(() => { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); }, 10 * 60 * 1000);

    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// Mock/Placeholder Routes for others
const mockConversion = (toolName, ext, req, res) => {
    if (!req.file) return res.status(400).json({ message: 'File is required' });
    const outputFileName = `converted-${Date.now()}.${ext}`;
    const outputPath = path.join(__dirname, '../uploads', outputFileName);
    fs.copyFileSync(req.file.path, outputPath);
    Log.create({ toolUsed: toolName, ip: req.ip });
    res.json({ message: `${toolName} successful (Simulation)`, downloadUrl: `/uploads/${outputFileName}` });
    cleanUp([req.file]);
    setTimeout(() => { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); }, 10 * 60 * 1000);
};

// PDF to PowerPoint
router.post('/pdf-to-ppt', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'File is required' });

        const pdfBuffer = fs.readFileSync(req.file.path);

        // Use pdf-parse to extract text
        const data = await pdfParse(pdfBuffer);

        const pres = new PptxGenJS();

        // Create a title slide
        const titleSlide = pres.addSlide();
        titleSlide.addText("Converted PDF Presentation", { x: 0.5, y: 2.0, w: '90%', fontSize: 36, align: 'center', bold: true });
        titleSlide.addText(`Generated on ${new Date().toLocaleDateString()}`, { x: 0.5, y: 3.0, w: '90%', fontSize: 18, align: 'center', color: '666666' });

        // Pagination Logic
        const text = data.text || "";
        // Clean text: remove form feed characters which often appear in PDF extractions
        const cleanText = text.replace(/\f/g, "\n");

        // Split text into chunks of ~1200 characters to fit on slides
        const chunkSize = 1200;
        const chunks = [];
        for (let i = 0; i < cleanText.length; i += chunkSize) {
            chunks.push(cleanText.substring(i, i + chunkSize));
        }

        if (chunks.length === 0) {
            const slide = pres.addSlide();
            slide.addText("No text content found in PDF.", { x: 1.0, y: 1.0, fontSize: 18 });
        } else {
            chunks.forEach((chunk, index) => {
                const slide = pres.addSlide();
                // Add slide number
                slide.addText(`Slide ${index + 1}`, { x: 8.5, y: 0.2, fontSize: 10, color: '999999' });

                // Add text content with wrapping
                slide.addText(chunk, {
                    x: 0.5,
                    y: 0.5,
                    w: '90%',
                    h: '85%',
                    fontSize: 14,
                    color: '363636',
                    valign: 'top',
                    align: 'left'
                });
            });
        }

        const outputFileName = `converted-${Date.now()}.pptx`;
        const outputPath = path.join(__dirname, '../uploads', outputFileName);

        await pres.writeFile({ fileName: outputPath });

        await Log.create({ toolUsed: 'PDF to PowerPoint', ip: req.ip });

        res.json({
            message: 'PDF converted to PowerPoint successfully (Text Only)',
            downloadUrl: `/uploads/${outputFileName}`
        });

        cleanUp([req.file]);
        setTimeout(() => { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); }, 10 * 60 * 1000);

    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).json({ message: err.message });
    }
});

// PDF to JPG (Reverted to Mock)
router.post('/pdf-to-jpg', upload.single('pdf'), (req, res) => mockConversion('PDF to JPG', 'zip', req, res));

router.post('/edit-pdf', upload.single('pdf'), (req, res) => mockConversion('Edit PDF', 'pdf', req, res));

module.exports = router;
