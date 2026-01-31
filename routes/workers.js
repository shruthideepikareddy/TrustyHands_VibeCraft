const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const { uploadWorkerFiles } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

// @route   POST /api/workers/register
// @desc    Register a new worker
// @access  Public
router.post('/register', uploadWorkerFiles, async (req, res) => {
    try {
        const {
            full_name, phone, email, dob, gender, location,
            service_type, experience, skills, languages, available_hours,
            min_price_per_hour, max_price_per_hour,
            agreement, confirmation
        } = req.body;

        // Validate required fields
        if (!full_name || !phone || !email || !dob || !gender || !location ||
            !service_type || !experience || !languages || !available_hours ||
            !min_price_per_hour || !max_price_per_hour) {
            return res.status(400).json({
                success: false,
                error: 'Please fill all required fields'
            });
        }

        // Validate agreements
        if (!agreement || !confirmation) {
            return res.status(400).json({
                success: false,
                error: 'You must agree to the terms and confirm your information'
            });
        }

        // Get file paths from uploaded files
        const id_proof_path = req.files['id_proof'] ? req.files['id_proof'][0].path : '';
        const resume_path = req.files['resume'] ? req.files['resume'][0].path : '';
        const profile_picture_path = req.files['profile_picture'] ? req.files['profile_picture'][0].path : '';
        const work_samples_path = req.files['work_samples'] ? req.files['work_samples'][0].path : '';

        // Create new worker
        const worker = new Worker({
            full_name,
            phone_number: phone,
            email,
            dob,
            gender,
            location,
            id_proof_path,
            service_type,
            experience: parseInt(experience),
            skills: skills || '',
            languages,
            available_hours,
            min_price_per_hour: parseFloat(min_price_per_hour),
            max_price_per_hour: parseFloat(max_price_per_hour),
            resume_path,
            profile_picture_path,
            work_samples_path,
            agreement_accepted: agreement === 'true' || agreement === true,
            info_confirmed: confirmation === 'true' || confirmation === true
        });

        await worker.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to TrustyHands.',
            worker: {
                id: worker._id,
                full_name: worker.full_name,
                service_type: worker.service_type,
                location: worker.location
            }
        });
    } catch (error) {
        console.error('Worker registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during registration'
        });
    }
});

// @route   GET /api/workers/search
// @desc    Search workers by service type and location
// @access  Public
router.get('/search', async (req, res) => {
    try {
        const { service, city } = req.query;

        if (!service || !city) {
            return res.status(400).json({
                success: false,
                error: 'Service type and city are required'
            });
        }

        const workers = await Worker.find({
            service_type: service,
            location: new RegExp(city, 'i') // Case-insensitive search
        });

        res.json({
            success: true,
            workers
        });
    } catch (error) {
        console.error('Worker search error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during search'
        });
    }
});

// @route   GET /api/workers/:id
// @desc    Get worker details by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);

        if (!worker) {
            return res.status(404).json({
                success: false,
                error: 'Worker not found'
            });
        }

        res.json({
            success: true,
            worker
        });
    } catch (error) {
        console.error('Get worker error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching worker'
        });
    }
});

module.exports = router;
