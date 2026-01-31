const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const Customer = require('../models/Customer');
const { isAuthenticated } = require('../middleware/auth');

// @route   GET /api/feedback/pending
// @desc    Get completed bookings pending feedback for current user
// @access  Private
router.get('/pending', isAuthenticated, async (req, res) => {
    try {
        const email = req.session.email;
        const user_id = req.session.user_id;

        // Find workers and customers for this email
        const workers = await Worker.find({ email });
        const customers = await Customer.find({ email });

        const workerIds = workers.map(w => w._id);
        const customerIds = customers.map(c => c._id);

        // Get completed bookings
        const completedBookings = await Booking.find({
            $or: [
                { worker_id: { $in: workerIds } },
                { customer_id: { $in: customerIds } }
            ],
            status: 'Completed'
        })
            .populate('worker_id')
            .populate('customer_id')
            .sort({ preferred_date: -1 });

        // Get feedback already submitted by this user
        const submittedFeedback = await Feedback.find({ user_id });
        const feedbackBookingIds = submittedFeedback.map(f => f.booking_id.toString());

        // Filter out bookings with feedback
        const pendingBookings = completedBookings.filter(booking =>
            !feedbackBookingIds.includes(booking._id.toString())
        );

        res.json({
            success: true,
            completed_work: pendingBookings.map(booking => ({
                id: booking._id,
                service_type: booking.service_type,
                preferred_date: booking.preferred_date,
                worker_name: booking.worker_id ? booking.worker_id.full_name : null,
                customer_name: booking.customer_id ? booking.customer_id.full_name : null
            }))
        });
    } catch (error) {
        console.error('Get pending feedback error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching pending feedback'
        });
    }
});

// @route   POST /api/feedback
// @desc    Submit feedback for a booking
// @access  Private
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { booking_id, rating, comments } = req.body;
        const user_id = req.session.user_id;
        const email = req.session.email;

        if (!booking_id || !rating) {
            return res.status(400).json({
                success: false,
                error: 'Booking ID and rating are required'
            });
        }

        // Verify user has access to this booking
        const booking = await Booking.findById(booking_id)
            .populate('worker_id')
            .populate('customer_id');

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        const hasAccess =
            (booking.worker_id && booking.worker_id.email === email) ||
            (booking.customer_id && booking.customer_id.email === email);

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                error: 'You do not have access to this booking'
            });
        }

        if (booking.status !== 'Completed') {
            return res.status(400).json({
                success: false,
                error: 'Can only provide feedback for completed bookings'
            });
        }

        // Check if feedback already exists
        const existingFeedback = await Feedback.findOne({ booking_id, user_id });
        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                error: 'You have already submitted feedback for this booking'
            });
        }

        // Create feedback
        const feedback = new Feedback({
            booking_id,
            user_id,
            rating: parseInt(rating),
            comments: comments || ''
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback!'
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error submitting feedback'
        });
    }
});

module.exports = router;
