const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');
const Checkup = require('../models/Checkup');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create new checkup request
router.post('/', auth, async (req, res) => {
    try {
        const { dentistId } = req.body;
        const checkup = new Checkup({
            patient: req.user.id,
            dentist: dentistId
        });
        await checkup.save();
        res.status(201).json(checkup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all checkups for a patient
router.get('/patient', auth, async (req, res) => {
    try {
        const checkups = await Checkup.find({ patient: req.user.id })
            .populate('dentist', 'name email');
        res.json(checkups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all checkups for a dentist
router.get('/dentist', auth, async (req, res) => {
    try {
        const checkups = await Checkup.find({ dentist: req.user.id })
            .populate('patient', 'name email');
        res.json(checkups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single checkup
router.get('/:id', auth, async (req, res) => {
    try {
        const checkup = await Checkup.findById(req.params.id)
            .populate('patient', 'name email')
            .populate('dentist', 'name email');
        
        if (!checkup) {
            return res.status(404).json({ message: 'Checkup not found' });
        }

        // Check if user is authorized to view this checkup
        if (checkup.patient._id.toString() !== req.user.id && 
            checkup.dentist._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(checkup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload images and add notes for a checkup
router.post('/:id/images', auth, upload.array('images', 5), async (req, res) => {
    try {
        const { descriptions } = req.body;
        const checkup = await Checkup.findById(req.params.id);

        if (!checkup) {
            return res.status(404).json({ message: 'Checkup not found' });
        }

        // Check if user is authorized to upload images
        if (checkup.dentist.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Add images with descriptions
        const images = req.files.map((file, index) => ({
            url: file.path,
            description: descriptions && descriptions[index] ? descriptions[index] : ''
        }));

        checkup.images = [...checkup.images, ...images];
        await checkup.save();

        res.json(checkup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update checkup status and notes
router.put('/:id', auth, async (req, res) => {
    try {
        const { status, notes } = req.body;
        const checkup = await Checkup.findById(req.params.id);

        if (!checkup) {
            return res.status(404).json({ message: 'Checkup not found' });
        }

        // Check if user is authorized to update
        if (checkup.dentist.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (status) checkup.status = status;
        if (notes) checkup.notes = notes;
        checkup.updatedAt = Date.now();

        await checkup.save();
        res.json(checkup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export checkup as PDF
router.get('/:id/export', auth, async (req, res) => {
    try {
        const checkup = await Checkup.findById(req.params.id)
            .populate('patient', 'name email')
            .populate('dentist', 'name email');

        if (!checkup) {
            return res.status(404).json({ message: 'Checkup not found' });
        }

        // Check if user is authorized to export
        if (checkup.patient._id.toString() !== req.user.id && 
            checkup.dentist._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=checkup-${checkup._id}.pdf`);
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text('Dental Checkup Report', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(14).text('Patient Information:');
        doc.fontSize(12).text(`Name: ${checkup.patient.name}`);
        doc.text(`Email: ${checkup.patient.email}`);
        doc.moveDown();

        doc.fontSize(14).text('Dentist Information:');
        doc.fontSize(12).text(`Name: Dr. ${checkup.dentist.name}`);
        doc.text(`Email: ${checkup.dentist.email}`);
        doc.moveDown();

        doc.fontSize(14).text('Checkup Details:');
        doc.fontSize(12).text(`Status: ${checkup.status}`);
        doc.text(`Date: ${new Date(checkup.createdAt).toLocaleDateString()}`);
        doc.moveDown();

        if (checkup.notes) {
            doc.fontSize(14).text('Notes:');
            doc.fontSize(12).text(checkup.notes);
            doc.moveDown();
        }

        if (checkup.images.length > 0) {
            doc.fontSize(14).text('Images:');
            doc.moveDown();
            
            for (const image of checkup.images) {
                // Add image description
                doc.fontSize(12).text(`Description: ${image.description}`);
                
                // Add the actual image
                try {
                    // Get the absolute path to the image
                    const imagePath = path.join(__dirname, '..', image.url);
                    
                    // Add image to PDF with a maximum width of 500 points
                    doc.image(imagePath, {
                        fit: [500, 400],
                        align: 'center'
                    });
                    
                    // Add upload date
                    doc.fontSize(10).text(`Uploaded: ${new Date(image.uploadedAt).toLocaleString()}`);
                    doc.moveDown(2);
                } catch (error) {
                    console.error('Error adding image to PDF:', error);
                    doc.text('Error: Could not load image');
                    doc.moveDown();
                }
            }
        }

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 