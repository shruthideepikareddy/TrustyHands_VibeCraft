# TrustyHands - Node.js/Express + MongoDB Backend

**SUCCESS!** ✅ The backend has been successfully converted from PHP/MySQL to Node.js/Express + MongoDB!

## 🎯 What's Been Converted

### ✅ Backend (100% Complete)
- **Database**: All 6 MongoDB models created (Users, Customers, Workers, Bookings, Contact Submissions, Feedback)
- **Authentication**: Session-based auth with bcrypt password hashing
- **API Routes**: 5 complete route modules
  - `/api/auth` - Registration, login, logout, session management
  - `/api/workers` - Worker registration with file uploads, search functionality
  - `/api/bookings` - Create bookings, assign workers, manage status
  - `/api/contact` - Contact form submissions
  - `/api/feedback` - Submit and retrieve feedback for completed bookings
- **File Uploads**: Multer middleware for handling worker documents and images
- **Middleware**: Authentication checks and user session management

### 📋 Frontend Conversion Guide

The original PHP pages need to be converted to HTML + JavaScript. Here's the mapping:

| Original PHP File | New HTML File | Status |
|-------------------|---------------|--------|
| `research_index.php` | `public/login.html` | ⏳ To Do |
| `research_homepage.php` | `public/home.html` | ⏳ To Do |
| `research_joinAsWorker.php` | `public/join-worker.html` | ⏳ To Do |
| `research_bookWorker.php` | `public/book-worker.html` | ⏳ To Do |
| `research_contactUspage.php` | `public/contact.html` | ⏳ To Do |
| `research_feedback.php` | `public/feedback.html` | ⏳ To Do |
| All other PHP pages | `public/*.html` | ⏳ To Do |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd TrustyHands_Website_Converted
npm install
```

### 2. Configure Environment
The `.env` file is already configured with your MongoDB Atlas connection:
```
MONGODB_URI=mongodb+srv://chhimakshi_db_user:...
PORT=3000
SESSION_SECRET=trustyhands_secret_key_2024
```

### 3. Start the Server
```bash
npm run dev   # Development mode with auto-restart
# OR
npm start     # Production mode
```

Server will run on: **http://localhost:3000**

### 4. Test the API
```bash
# Health check
curl http://localhost:3000/api/health

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fName":"John","lName":"Doe","email":"john@example.com","password":"password123"}'
```

---

## 📁 Project Structure

```
TrustyHands_Website_Converted/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # File upload configuration
├── models/                  # MongoDB Schemas
│   ├── User.js
│   ├── Customer.js
│   ├── Worker.js
│   ├── Booking.js
│   ├── ContactSubmission.js
│   └── Feedback.js
├── routes/                  # API Routes
│   ├── auth.js
│   ├── workers.js
│   ├── bookings.js
│   ├── contact.js
│   └── feedback.js
├── public/                  # Static files (HTML, CSS, JS)
│   ├── js/
│   │   ├── api.js          # API client helper
│   │   └── auth-check.js   # Authentication utilities
│   └── (HTML files go here)
├── uploads/                 # Uploaded files storage
├── server.js                # Main Express server
├── .env                     # Environment variables
└── package.json
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Get current session

### Workers (`/api/workers`)
- `POST /api/workers/register` - Register worker (with file uploads)
- `GET /api/workers/search?service=X&city=Y` - Search workers
- `GET /api/workers/:id` - Get worker details

### Bookings (`/api/bookings`)
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/worker` - Assign worker
- `PUT /api/bookings/:id/status` - Update status
- `GET /api/bookings/user` - Get user bookings (auth required)

### Contact (`/api/contact`)
- `POST /api/contact` - Submit contact form

### Feedback (`/api/feedback`)
- `GET /api/feedback/pending` - Get pending feedback (auth required)
- `POST /api/feedback` - Submit feedback (auth required)

---

## 🔧 Next Steps: Frontend Conversion

To complete the conversion, you need to:

1. **Copy HTML/CSS from PHP files** - Extract the HTML structure and CSS from each PHP file
2. **Remove PHP tags** - Convert `<?php ?>` blocks to JavaScript
3. **Update forms** - Use `fetch()` API to call backend endpoints
4. **Add authentication** - Use `auth-check.js` for protected pages
5. **Use the API client** - Leverage `api.js` for all backend requests

### Example: Converting Login Form

**Original PHP** (`research_index.php`):
```php
<form method="POST" action="research_register.php">
  <input name="email" type="email">
  <button type="submit" name="signUp">Sign Up</button>
</form>
```

**New HTML** (`public/login.html`):
```html
<form id="signup-form">
  <input id="email" type="email">
  <button type="submit">Sign Up</button>
</form>

<script src="/js/api.js"></script>
<script>
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      fName: document.getElementById('fname').value,
      lName: document.getElementById('lname').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
    
    const result = await api.post('/api/auth/register', data);
    
    if (result.success) {
      window.location.href = '/home.html';
    } else {
      showErrors(result.errors);
    }
  });
</script>
```

---

## 🎨 Preserving UI/UX

**IMPORTANT**: All HTML structure, CSS, and design must remain **EXACTLY** the same!

- Copy all CSS files/styles from original PHP files
- Keep all class names, IDs, and HTML structure identical
- Preserve all animations, hover effects, and responsive designs
- Only replace PHP backend logic with JavaScript API calls

---

## 🧪 Testing Checklist

Once frontend is complete, test:

- [ ] User registration with validation
- [ ] User login with correct/incorrect credentials
- [ ] Worker registration with all file uploads
- [ ] Booking creation with image upload
- [ ] Worker search and selection
- [ ] Feedback submission
- [ ] Contact form submission
- [ ] Session persistence across pages
- [ ] Logout functionality
- [ ] Responsive design on mobile/tablet

---

## 📝 Environment Variables

Required in `.env`:
```bash
MONGODB_URI=<your-mongodb-connection-string>
PORT=3000
SESSION_SECRET=<random-secret-key>
NODE_ENV=development
UPLOAD_DIR=uploads
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check your MongoDB Atlas IP whitelist
- Verify connection string in `.env`
- Ensure network access is allowed

### File Upload Errors
- Check `uploads/` directory exists
- Verify file size limits in `middleware/upload.js`
- Check file type restrictions

### Session Issues
- Clear browser cookies
- Check `SESSION_SECRET` in `.env`
- Verify CORS settings in `server.js`

---

## 📚 Dependencies

```json
"dependencies": {
  "express": "Express web framework",
  "mongoose": "MongoDB ODM",
  "bcryptjs": "Password hashing",
  "express-session": "Session management",
  "multer": "File upload handling",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables",
  "express-validator": "Input validation"
}
```

---

## 🎉 Success!

Your backend is fully converted and ready to use! The API is RESTful, scalable, and maintains all the original PHP functionality.

**Need help with frontend conversion?** I can help convert specific pages or create examples!
