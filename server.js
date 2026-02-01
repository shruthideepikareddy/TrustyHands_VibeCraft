const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const connectDB = require('./config/database');
const { attachUserData } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const workerRoutes = require('./routes/workers');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Connect to MongoDB
connectDB();

// Trust Proxy for Render/Heroku (Required for secure cookies behind load balancer)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'trustyhands_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Attach user data to requests
app.use(attachUserData);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'TrustyHands API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            error: `File upload error: ${err.message}`
        });
    }

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n🚀 TrustyHands Server is running on port ${PORT}`);
    console.log(`📍 Visit: http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
