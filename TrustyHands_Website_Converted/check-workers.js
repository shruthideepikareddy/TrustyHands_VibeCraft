const mongoose = require('mongoose');
require('dotenv').config();
const Worker = require('./models/Worker');

async function checkWorkers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        const workers = await Worker.find({});
        console.log('Total workers:', workers.length);
        workers.forEach(w => {
            console.log(`- ${w.full_name}: ${w.service_type} in ${w.location}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkWorkers();
