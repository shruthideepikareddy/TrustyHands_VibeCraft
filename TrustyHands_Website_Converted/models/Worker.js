const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    id_proof_path: {
        type: String,
        default: ''
    },
    service_type: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: Number,
        required: true
    },
    skills: {
        type: String,
        default: ''
    },
    languages: {
        type: String,
        required: true
    },
    available_hours: {
        type: String,
        required: true
    },
    min_price_per_hour: {
        type: Number,
        required: true
    },
    max_price_per_hour: {
        type: Number,
        required: true
    },
    resume_path: {
        type: String,
        default: ''
    },
    profile_picture_path: {
        type: String,
        default: ''
    },
    work_samples_path: {
        type: String,
        default: ''
    },
    agreement_accepted: {
        type: Boolean,
        default: false
    },
    info_confirmed: {
        type: Boolean,
        default: false
    },
    avg_rating: {
        type: Number,
        default: 4.5
    },
    total_reviews: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Worker', workerSchema);
