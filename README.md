# TrustyHands - Premium Home Services Platform

**Live Demo:** [https://trustyhands-vibecraft.onrender.com](https://trustyhands-vibecraft.onrender.com)

**Video Explanation:** [Watch Project Demo](https://drive.google.com/file/d/1fiAWaLlj8AMM6FRUS05EL6YWRNpIEfRe/view?usp=sharing)

## 📖 Project Overview
**TrustyHands** is a comprehensive full-stack web application designed to connect homeowners with skilled local service professionals. Whether it's plumbing, cleaning, or electrical repairs, TrustyHands offers a seamless, secure, and user-friendly platform to book reliable help in just a few clicks.

Built with the **MERN Stack** (MongoDB, Express.js, React-logic via EJS/HTML, Node.js), it features a robust booking system, real-time worker availability, and a dedicated admin dashboard for platform management.

## 🚀 Key Features

### For Customers:
*   **Smart Service Search:** Instantly find services with keyword search and categorized listings.
*   **4-Step Booking Wizard:** A guided flow to select service, date, location, and preferred worker.
*   **Real-time Availability:** View distinct time slots (Morning, Afternoon, Evening) for appointments.
*   **User Dashboard:** Track booking status (Pending, Confirmed, Completed) and history.
*   **Geolocation Integration:** Auto-detect current location for service address.

### For Professionals (Workers):
*   **Profile Management:** Showcase skills, experience, and ratings.
*   **Job Requests:** Receive and manage incoming booking requests.

### For Administrators:
*   **Admin Dashboard:** Centralized control panel to oversee platform activity.
*   **Worker Approvals:** Verify and approve new service provider registrations.
*   **Booking Management:** Monitor all bookings and their execution status.

## 🛠️ Technology Stack
*   **Frontend:** HTML5, CSS3 (Custom Design System), JavaScript (ES6+), FontAwesome
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas (Cloud)
*   **Authentication:** Session-based Auth (Express-Session), BCrypt for security
*   **Deployment:** Render (Web Service)

## 📦 Installation & Setup

To run this project locally, follow these steps:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/himakshi-08/TrustyHands_VibeCraft.git
    cd TrustyHands_VibeCraft
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    SESSION_SECRET=your_secret_key
    PORT=3000
    NODE_ENV=development
    ```

4.  **Start the Server**
    ```bash
    npm start
    ```

5.  **Visit the App**
    Open `http://localhost:3000` in your browser.

## 📂 Project Structure
```
TrustyHands/
├── config/             # Database configuration
├── models/             # Mongoose Data Models (User, Booking, Worker)
├── routes/             # API Routes
├── public/             # Static Assets (HTML, CSS, JS, Images)
├── middleware/         # Auth & Utility Middleware
├── server.js           # Application Entry Point
└── package.json        # Dependencies & Scripts
```

## 🤝 Contributing
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License
This project is licensed under the ISC License.

