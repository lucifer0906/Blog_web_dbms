const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

// ENV config
dotenv.config();

// MongoDB connection
connectDB();

// App initialization
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Static file serving for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// Port setup
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(
        `✅ Server Running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
    );
});
