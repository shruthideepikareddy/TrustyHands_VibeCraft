const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        default: null
    },
    service_type: {
        type: String,
        required: true,
        trim: true
    },
    preferred_date: {
        type: Date,
        required: true
    },
    problem_description: {
        type: String,
        default: ''
    },
    tools_required: {
        type: String,
        default: ''
    },
    image_path: {
        type: String,
        default: ''
    },
    payment_mode: {
        type: String,
        enum: ['Cash', 'UPI', 'Card'],
        default: 'Cash'
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed'],
        default: 'Pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
