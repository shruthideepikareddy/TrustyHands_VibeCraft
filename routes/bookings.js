const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Worker = require('../models/Worker');
const { uploadImage } = require('../middleware/upload');
const { isAuthenticated } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', uploadImage.single('image'), async (req, res) => {
    try {
        const {
            full_name, phone, email, address, city, service,
            date, problem_description, tools_required, payment, worker_id
        } = req.body;

        // Validate required fields
        if (!full_name || !phone || !email || !address || !service || !date) {
            console.error('Booking validation failed. Missing fields:', {
                full_name: !!full_name,
                phone: !!phone,
                email: !!email,
                address: !!address,
                service: !!service,
                date: !!date
            });
            return res.status(400).json({
                success: false,
                error: 'Please fill all required fields'
            });
        }

        // Create customer
        const customer = new Customer({
            full_name,
            phone_number: phone,
            email,
            address: `${address}, ${city || ''}`
        });

        await customer.save();

        // Get image path if uploaded
        const image_path = req.file ? req.file.path : '';

        // Create booking
        const booking = new Booking({
            customer_id: customer._id,
            worker_id: worker_id || null, // Optional at creation
            service_type: service,
            preferred_date: new Date(date),
            problem_description: problem_description || '',
            tools_required: tools_required || '',
            image_path,
            payment_mode: payment || 'Cash'
        });

        await booking.save();

        // Find available workers for this service and city
        const workers = await Worker.find({
            service_type: service,
            location: new RegExp(city, 'i')
        });

        res.status(201).json({
            success: true,
            message: 'Your booking details have been saved. Please contact the worker using their phone number and confirm the worker.',
            booking_id: booking._id,
            workers
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error creating booking'
        });
    }
});

// @route   PUT /api/bookings/:id/worker
// @desc    Assign worker to booking
// @access  Public
router.put('/:id/worker', async (req, res) => {
    try {
        const { worker_id } = req.body;

        if (!worker_id) {
            return res.status(400).json({
                success: false,
                error: 'Worker ID is required'
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { worker_id },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Worker selected successfully! Booking is now complete.',
            booking
        });
    } catch (error) {
        console.error('Worker assignment error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error assigning worker'
        });
    }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (could add admin check)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status value'
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking status updated',
            booking
        });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error updating status'
        });
    }
});

// @route   GET /api/bookings
// @desc    Get all bookings (Admin/Public for now)
// @access  Public (Should be Admin)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('customer_id')
            .populate('worker_id')
            .sort({ created_at: -1 });

        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching bookings'
        });
    }
});

// @route   GET /api/bookings/user
// @desc    Get bookings for current user (customer or worker)
// @access  Private
router.get('/user', isAuthenticated, async (req, res) => {
    try {
        const email = req.session.email;

        // Find customer bookings
        const customers = await Customer.find({ email });
        const customerIds = customers.map(c => c._id);

        // Find worker bookings
        const workers = await Worker.find({ email });
        const workerIds = workers.map(w => w._id);

        // Get all bookings
        const bookings = await Booking.find({
            $or: [
                { customer_id: { $in: customerIds } },
                { worker_id: { $in: workerIds } }
            ]
        })
            .populate('customer_id')
            .populate('worker_id')
            .sort({ created_at: -1 });

        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching bookings'
        });
    }
});

module.exports = router;
