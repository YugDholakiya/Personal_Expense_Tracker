const db_connect = require("./config/db");
const express = require("express");
const user = require("./models/user");
require('dotenv').config();
const auth = require("./routes/auth");
const cookie_parser = require('cookie-parser');
const exp = require("./routes/expense");
const client = require("./config/redis");
const connectRadis = require("./config/redis");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());

// CORS configuration - use environment variables for flexibility
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.use("/auth", auth);
app.use("/expense", exp);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

const start_server = async function () {
    try {
        const PORT = process.env.PORT || 5000;
        
        await Promise.all([db_connect, client.connect()])
        console.log("✓ Database and Redis Connected");

        app.listen(PORT, () => {
            console.log(`✓ Server is running on port ${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
        })
    } catch (err) {
        console.error("✗ Server startup failed:", err.message);
        process.exit(1);
    }
}

start_server();
