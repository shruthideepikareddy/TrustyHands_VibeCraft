const mongoose = require('mongoose');
require('dotenv').config();
const Worker = require('./models/Worker');

const sampleWorkers = [
    {
        full_name: "Rajesh Kumar",
        phone_number: "+91-9876543210",
        email: "rajesh.kumar@example.com",
        dob: new Date("1990-05-15"),
        gender: "Male",
        location: "Bangalore",
        service_type: "Plumber",
        experience: 5,
        skills: "Pipe fitting, leak repair, bathroom installation",
        languages: "English, Hindi, Kannada",
        available_hours: "9 AM - 6 PM",
        min_price_per_hour: 300,
        max_price_per_hour: 500,
        profile_picture_path: "",
        avg_rating: 4.5,
        total_reviews: 23,
        agreement_accepted: true,
        info_confirmed: true
    },
    {
        full_name: "Priya Sharma",
        phone_number: "+91-9876543211",
        email: "priya.sharma@example.com",
        dob: new Date("1992-08-20"),
        gender: "Female",
        location: "Bangalore",
        service_type: "Electrician",
        experience: 4,
        skills: "Wiring, circuit repair, appliance installation",
        languages: "English, Hindi",
        available_hours: "10 AM - 7 PM",
        min_price_per_hour: 350,
        max_price_per_hour: 600,
        profile_picture_path: "",
        avg_rating: 4.8,
        total_reviews: 45,
        agreement_accepted: true,
        info_confirmed: true
    },
    {
        full_name: "Amit Patel",
        phone_number: "+91-9876543212",
        email: "amit.patel@example.com",
        dob: new Date("1988-03-10"),
        gender: "Male",
        location: "Bangalore",
        service_type: "Carpenter",
        experience: 8,
        skills: "Furniture making, door installation, wood polishing",
        languages: "English, Hindi, Gujarati",
        available_hours: "8 AM - 5 PM",
        min_price_per_hour: 400,
        max_price_per_hour: 700,
        profile_picture_path: "",
        avg_rating: 4.7,
        total_reviews: 67,
        agreement_accepted: true,
        info_confirmed: true
    },
    {
        full_name: "Sunita Reddy",
        phone_number: "+91-9876543213",
        email: "sunita.reddy@example.com",
        dob: new Date("1995-11-25"),
        gender: "Female",
        location: "Bangalore",
        service_type: "House Cleaning",
        experience: 3,
        skills: "Deep cleaning, sanitization, organization",
        languages: "English, Telugu, Kannada",
        available_hours: "7 AM - 4 PM",
        min_price_per_hour: 200,
        max_price_per_hour: 350,
        profile_picture_path: "",
        avg_rating: 4.9,
        total_reviews: 89,
        agreement_accepted: true,
        info_confirmed: true
    },
    {
        full_name: "Mohammed Ali",
        phone_number: "+91-9876543214",
        email: "mohammed.ali@example.com",
        dob: new Date("1987-07-18"),
        gender: "Male",
        location: "Bangalore",
        service_type: "Painter",
        experience: 10,
        skills: "Interior painting, exterior painting, wall texture",
        languages: "English, Hindi, Urdu",
        available_hours: "9 AM - 6 PM",
        min_price_per_hour: 350,
        max_price_per_hour: 550,
        profile_picture_path: "",
        avg_rating: 4.6,
        total_reviews: 52,
        agreement_accepted: true,
        info_confirmed: true
    },
    {
        full_name: "Lakshmi Iyer",
        phone_number: "+91-9876543215",
        email: "lakshmi.iyer@example.com",
        dob: new Date("1993-02-14"),
        gender: "Female",
        location: "Mumbai",
        service_type: "Plumber",
        experience: 6,
        skills: "Drainage systems, water heater installation, tap repair",
        languages: "English, Hindi, Tamil",
        available_hours: "10 AM - 7 PM",
        min_price_per_hour: 320,
        max_price_per_hour: 520,
        profile_picture_path: "",
        avg_rating: 4.4,
        total_reviews: 34,
        agreement_accepted: true,
        info_confirmed: true
    },
    {
        full_name: "Vikram Singh",
        phone_number: "+91-9876543216",
        email: "vikram.singh@example.com",
        dob: new Date("1991-09-30"),
        gender: "Male",
        location: "Delhi",
        service_type: "Electrician",
        experience: 7,
        skills: "Industrial wiring, smart home setup, solar panel installation",
        languages: "English, Hindi, Punjabi",
        available_hours: "8 AM - 6 PM",
        min_price_per_hour: 400,
        max_price_per_hour: 650,
        profile_picture_path: "",
        avg_rating: 4.7,
        total_reviews: 71,
        agreement_accepted: true,
        info_confirmed: true
    },
    {
        full_name: "Anita Desai",
        phone_number: "+91-9876543217",
        email: "anita.desai@example.com",
        dob: new Date("1994-06-22"),
        gender: "Female",
        location: "Bangalore",
        service_type: "Gardener",
        experience: 4,
        skills: "Lawn maintenance, plant care, landscaping",
        languages: "English, Hindi, Marathi",
        available_hours: "6 AM - 2 PM",
        min_price_per_hour: 250,
        max_price_per_hour: 400,
        profile_picture_path: "",
        avg_rating: 4.8,
        total_reviews: 41,
        agreement_accepted: true,
        info_confirmed: true
    }
];

async function seedWorkers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing workers (optional - comment out if you want to keep existing ones)
        // await Worker.deleteMany({});
        // console.log('🗑️  Cleared existing workers');

        // Insert sample workers
        const result = await Worker.insertMany(sampleWorkers);
        console.log(`✅ Successfully added ${result.length} workers to the database!`);

        console.log('\n📋 Workers by location:');
        const bangalore = result.filter(w => w.location === 'Bangalore');
        const mumbai = result.filter(w => w.location === 'Mumbai');
        const delhi = result.filter(w => w.location === 'Delhi');

        console.log(`   Bangalore: ${bangalore.length} workers`);
        console.log(`   Mumbai: ${mumbai.length} workers`);
        console.log(`   Delhi: ${delhi.length} workers`);

        console.log('\n📋 Workers by service:');
        const services = {};
        result.forEach(w => {
            services[w.service_type] = (services[w.service_type] || 0) + 1;
        });
        Object.entries(services).forEach(([service, count]) => {
            console.log(`   ${service}: ${count} worker(s)`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

seedWorkers();
