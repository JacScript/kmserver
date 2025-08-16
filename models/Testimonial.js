const { model, Schema } = require('mongoose');

// Define the schema for a Testimonial
const schema = new Schema({
  // The name of the person giving the testimonial
  name: {
    type: String,
    required: true,
  },

  // Optional profile image URL for the person
  profileImg: {
    type: String, // Store as a URL to a hosted image (e.g., S3, Cloudinary)
    required: false,
    // Example: "https://example.com/images/user123.jpg"
  },

  // The testimonial text provided by the person
  description: {
    type: String,
    required: true,
    // Consider limiting length for front-end display (e.g., maxLength: 500)
  },

  // Optional country flag image URL (e.g., to show nationality)
  flag: {
    type: String,
    required: false,
    // Example: "https://example.com/flags/france.png"
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  featured: {
    type: Boolean,
    default: false, // Default to false if not specified
    // Indicates if this testimonial should be highlighted on the site
  },
}, {
  timestamps: true, // Automatically includes createdAt and updatedAt
});

// Optional: Improve performance by indexing the timestamp fields
schema.index({ createdAt: -1 }, { background: true }); // For sorting by most recent
schema.index({ updatedAt: -1 }, { background: true }); // For detecting recent updates

// Create and export the Testimonial model
const Testimonial = model('Testimonial', schema);

// Export the Testimonial model for use in other parts of the application
module.exports = Testimonial;
