const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/ContactSubmission');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { full_name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!full_name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Please fill all required fields'
            });
        }

        // Create contact submission
        const contactSubmission = new ContactSubmission({
            full_name,
            email,
            phone: phone || '',
            subject,
            message
        });

        await contactSubmission.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.'
        });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error submitting contact form'
        });
    }
});

module.exports = router;
