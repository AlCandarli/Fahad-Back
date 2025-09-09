require("dotenv").config();
const express = require("express");
const connectDB = require('./Config/dbConn');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const corsOptions = require('./Config/corsOptions');
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", require ("./routes/root"));
app.use("/auth", require ("./routes/authRoutes"));
app.use("/users", require ("./routes/userRoutes"));
app.use("/gifts", require ("./routes/giftsRoutes"));

// 404 handler
app.all('*', (req, res) => {
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.status(404).json({ error: 'Not Found' });
    } else {
        res.status(404).type('txt').send('Not Found');
    }
});

// Export the app for Vercel
module.exports = app;

// For local development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    mongoose.connection.once("open", ()=>{
        console.log('Connected to DB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
    mongoose.connection.on("error", (err)=> {
        console.log('Database connection error:', err);
    });
}