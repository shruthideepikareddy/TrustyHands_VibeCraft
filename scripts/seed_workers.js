const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Worker = require('../models/Worker');

const seedWorkers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const workers = [
            {
                full_name: "Rajesh Kumar",
                phone_number: "9876543210",
                email: "rajesh.plumber@example.com",
                dob: new Date("1985-06-15"),
                gender: "Male",
                location: "Andheri West, Mumbai 400053",
                service_type: "Plumbing Services",
                experience: 8,
                skills: "Pipe repair, Leakages, Installation",
                languages: "Hindi, English, Marathi",
                available_hours: "9 AM - 6 PM",
                min_price_per_hour: 400,
                max_price_per_hour: 600,
                status: "approved",
                agreement_accepted: true,
                info_confirmed: true
            },
            {
                full_name: "Sita Sharma",
                phone_number: "9876543211",
                email: "sita.clean@example.com",
                dob: new Date("1990-08-20"),
                gender: "Female",
                location: "Vashi, Navi Mumbai 400703",
                service_type: "Deep Cleaning",
                experience: 4,
                skills: "Home cleaning, Sanitization",
                languages: "Hindi, English",
                available_hours: "10 AM - 5 PM",
                min_price_per_hour: 300,
                max_price_per_hour: 450,
                status: "approved",
                agreement_accepted: true,
                info_confirmed: true
            },
            {
                full_name: "Vikram Singh",
                phone_number: "9876543212",
                email: "vikram.elec@example.com",
                dob: new Date("1988-03-10"),
                gender: "Male",
                location: "Connaught Place, Delhi 110001",
                service_type: "Electrical Work",
                experience: 6,
                skills: "Wiring, Appliance Repair",
                languages: "Hindi, English",
                available_hours: "8 AM - 8 PM",
                min_price_per_hour: 500,
                max_price_per_hour: 700,
                status: "pending", // Pending approval
                agreement_accepted: true,
                info_confirmed: true
            },
            {
                full_name: "Amit Patel",
                phone_number: "9876543213",
                email: "amit.carpenter@example.com",
                dob: new Date("1982-11-05"),
                gender: "Male",
                location: "Koramangala, Bangalore 560034",
                service_type: "Carpentry",
                experience: 12,
                skills: "Furniture making, Repairs",
                languages: "Hindi, English, Kannada",
                available_hours: "9 AM - 7 PM",
                min_price_per_hour: 600,
                max_price_per_hour: 900,
                status: "pending", // Pending approval
                agreement_accepted: true,
                info_confirmed: true
            }
        ];

        console.log('Clearing existing test workers (optional step, skipping to append)...');
        // await Worker.deleteMany({}); // Uncomment to wipe DB

        console.log(`Seeding ${workers.length} workers...`);
        await Worker.insertMany(workers);

        console.log('✅ Seed successful!');
        console.log('1. Check "Plumbing Services" or "Deep Cleaning" in Mumbai for APPROVED workers.');
        console.log('2. Check Admin Dashboard for "Electrical Work" or "Carpentry" in PENDING list.');

        process.exit();
    } catch (error) {
        console.error('Seed verification failed:', error);
        process.exit(1);
    }
};

seedWorkers();
