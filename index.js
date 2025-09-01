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
const requestRoutes = require("./routes/request.js");
const homeRoutes = require("./routes/home.js");
const packageRoutes = require("./routes/package.js");
const homePageRoutes = require("./routes/homepage.js");
const aboutRoutes = require("./routes/about.js");


const cors = require("cors")

// Create Express app
const application = express();
application.use(express.urlencoded({ extended: true }));
application.use(cookieParser()); // ✅ Enables reading cookies

// Environment config
const port = process.env.PORT || 3000;
const MONGOURL = process.env.MONGOURL;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  // "https://kaimaembe.com/",
  // "https://admin.kaimaembe.com"
  // "http://127.0.0.1:3001",
  // "http://127.0.0.1:5000"
];

// Parse JSON requests
application.use(express.json());
// Middleware to parse URL-encoded data (optional)
// ✅ Correct syntax with proper indentation and corrected origin IP
// application.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "http://127.0.0.1:3000",
//     "http://localhost:5000",
//     "http://127.0.0.1:5000"
//   ],
//   credentials: true
// }));

application.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like curl or mobile apps
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Routes
application.get("/", (req, res) => {
    res.send("Welcome to KM Tours API");
});
application.use("/api/auth", authRoutes);
application.use("/api/testimonial", testimonialRoutes);
application.use("/api/request", requestRoutes);
application.use("/api/home", homeRoutes);
application.use("/api/package", packageRoutes);
application.use("/api/homepage", homePageRoutes);
application.use("/api/about", aboutRoutes);

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