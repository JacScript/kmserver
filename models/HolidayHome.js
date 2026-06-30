const { model, Schema } = require("mongoose");

// Define the schema for the Apartment model
const schema = new Schema({
    // Used to build the apartment's own URL (/apartments/:slug) and to look
    // it up on the detail page — required by the frontend's routing.
    slug: {
        type: String,
        required: [true, 'Slug is required.'],
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [2, 'Slug must be at least 2 characters long.']
    },
    type: {
        type: String,
        required: [true, 'Type is required.'], // Added custom error message
        trim: true, // Trim whitespace from the beginning and end of the string
        minlength: [2, 'Type must be at least 2 characters long.'] // Example validation
    },
    images : [
        {type: String,
     required: [true, 'Image URL is required.']
     }
    ],
    price : {
        type: Number,
        required: [true, 'Price is required.'], // Added custom error message
        min: [0, 'Price must be a positive number.'] // Example validation
    },
    title: 
       { type: String,
        required: [true, 'Title is required.'], // Added custom error message
        trim: true, // Trim whitespace from the beginning and end of the string
        minlength: [2, 'Title must be at least 2 characters long.'] // Example validation
},
    subtitle: {
        type: String,
        required: [true, 'Subtitle is required.'], // Added custom error message
        trim: true, // Trim whitespace from the beginning and end of the string
        minlength: [2, 'Subtitle must be at least 2 characters long.'] // Example validation
    },
    location: {
        type: String,
        required: [true, 'Location is required.'], // Added custom error message
        trim: true, // Trim whitespace from the beginning and end of the string
        minlength: [2, 'Location must be at least 2 characters long.'] // Example validation
    },
    guests: {
        type: Number,
        required: [true, 'Guests is required.'], // Added custom error message
        min: [1, 'Guest must be a positive number.'] // Example validation
    },
    features: [
        {
            type: String,
            required: [true, 'Feature is required.'], // Added custom error message
            trim: true, // Trim whitespace from the beginning and end of the string
            minlength: [2, 'Feature must be at least 2 characters long.'] // Example validation
        }
    ],
    // rating: {
    //     type: Number,
    //     required: [true, 'Rating is required.'], // Added custom error message
    //     min: [0, 'Rating must be a positive number.'], // Example validation
    //     max: [5, 'Rating cannot exceed 5.'] // Example validation}
    // },

    // Renamed from `available` to `availability` to match what the
    // frontend (ApartmentCard / ApartmentDetailPage) actually reads.
    availability: {
        type: Boolean,
        default: true // Default to true or false as per your business logic
    },

    // Human-readable date shown when availability is false, e.g.
    // "September 2025" — drives the "Available starting from..." line
    // on the card and the announcement banner on the detail page.
    availableFrom: {
        type: String,
        trim: true
    },

    description: {
        type: String,
        required: [true, 'Description is required.'], // Added custom error message
        trim: true, // Trim whitespace from the beginning and end of the string
        //minlength: [10, 'Description must be at least 10 characters long.'] // Example validation
    }
}, {
    timestamps: true, // Automatically includes createdAt and updatedAt 
});

// Optional: Improve performance by indexing the timestamp fields
schema.index({ createdAt: -1 }, { background: true }); // For sorting by most recent
schema.index({ updatedAt: -1 }, { background: true }); // For detecting recent updates

// Create and export the HolidayHomePage model
const HolidayHomePage = model('HolidayHomePage', schema);

// Export the HolidayHomePage model for use in other parts of the application
module.exports = HolidayHomePage;