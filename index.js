"use strict";

// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Imports
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { notFound, errorHandler } = require("./middlewares/globalErrorHandler");
const authRoutes = require("./routes/auth.js");
const testimonialRoutes = require("./routes/testimonial.js");

// Create Express app
const application = express();
application.use(cookieParser()); // ✅ Enables reading cookies

// Environment config
const port = process.env.PORT || 3000;
const MONGOURL = process.env.MONGOURL;

// Parse JSON requests
application.use(express.json());

// Routes
application.use("/auth", authRoutes);
application.use("/testimonial", testimonialRoutes);

// Middleware to handle 404 errors and global errors
application.use(notFound);
application.use(errorHandler);


// Function to connect to MongoDB with retry logic
async function connectWithRetry() {
    try {
        // Attempt to connect to the MongoDB database
        await mongoose.connect(MONGOURL,
            {
                // Options to deal with deprecation warnings
                // useCreateIndex: true,
                // useFindAndModify: false,
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }
        );
      

        // If the database connection is successful, start the server
        application.listen(port, '127.0.0.1', () => {
            console.log('Server listening on port 8000');
            console.log(`Database has been connected and server is running on port ${port}`);
        });

    } catch (error) {
        // Log any connection errors and retry after 5 seconds
        console.log(`Database connection error: ${error.message}`);
        setTimeout(connectWithRetry, 5000);
    }
}

// Attempt to connect to the database when the server starts
connectWithRetry();

// Graceful shutdown handling (Optional but recommended)
// process.on('SIGINT', async () => {
//     console.log('Shutting down server...');
//     await mongoose.connection.close();
//     process.exit(0); // Exit gracefully
// });

// // Handle uncaught exceptions and unhandled rejections
// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception:', err);
//     process.exit(1); // Exit the process after handling the error
// });

// process.on('unhandledRejection', (reason, promise) => {
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//     process.exit(1); // Exit the process after handling the rejection
// });