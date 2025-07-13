const { model, Schema} = require("mongoose");

//Define the schema for the Home model
const schema = new Schema({
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
    // available: {
    //     type: String,
    //     // required: [true, 'Availability status is required.'], // Added custom error message
    //     enum: ['available', 'unavailable'], // Example validation for availability status
    //     default: 'available' // Default value if not specified
    // },

    available: {
    type: Boolean,
    // required: [true, 'Availability status is required.'], // Keep if you want it required
    default: true // Default to true or false as per your business logic
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

// Create and export the Home model
const Home = model('Home', schema);

// Export the Home model for use in other parts of the application
module.exports = Home;