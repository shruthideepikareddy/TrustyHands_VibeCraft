const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Customer = require('../models/Customer');
const Worker = require('../models/Worker');
const { body, validationResult } = require('express-validator');
const { uploadProfilePicture } = require('../middleware/upload');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('fName').trim().isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z ]{2,50}$/),
    body('lName').trim().isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z ]{2,50}$/),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => err.msg)
            });
        }

        const { fName, lName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                errors: ['Email Address Already Exists!']
            });
        }

        // Create new user
        const user = new User({
            firstName: fName,
            lastName: lName,
            email,
            password
        });

        await user.save();

        // Set session
        req.session.user_id = user._id;
        req.session.firstName = user.firstName;
        req.session.email = user.email;

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error during registration']
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: ['Invalid email format']
            });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                errors: ['Email not found']
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                errors: ['Incorrect password']
            });
        }

        // Set session
        req.session.user_id = user._id;
        req.session.firstName = user.firstName;
        req.session.email = user.email;

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error during login']
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
});

// @route   GET /api/auth/session
// @desc    Get current session data
// @access  Public
router.get('/session', (req, res) => {
    if (req.session && req.session.user_id) {
        res.json({
            authenticated: true,
            user: {
                id: req.session.user_id,
                firstName: req.session.firstName,
                email: req.session.email
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

// @route   GET /api/auth/profile
// @desc    Get full user profile including worker/customer details
// @access  Private
router.get('/profile', async (req, res) => {
    try {
        if (!req.session || !req.session.user_id) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const email = req.session.email;
        const user = await User.findById(req.session.user_id);
        const worker = await Worker.findOne({ email });
        const customer = await Customer.findOne({ email });

        res.json({
            success: true,
            user,
            worker: worker || null,
            customer: customer || null,
            is_worker: !!worker,
            is_customer: !!customer
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', uploadProfilePicture.single('profileImage'), async (req, res) => {
    try {
        if (!req.session || !req.session.user_id) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const userId = req.session.user_id;
        const updateData = {};

        // Update text fields if provided
        if (req.body.firstName) updateData.firstName = req.body.firstName.trim();
        if (req.body.lastName) updateData.lastName = req.body.lastName.trim();
        if (req.body.phoneNumber) updateData.phoneNumber = req.body.phoneNumber.trim();
        if (req.body.city) updateData.city = req.body.city.trim();
        if (req.body.address) updateData.address = req.body.address.trim();

        // Handle profile image upload
        if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Update session if name changed
        if (updateData.firstName) {
            req.session.firstName = user.firstName;
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                city: user.city,
                address: user.address,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, error: 'Server error updating profile' });
    }
});

module.exports = router;
