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
        required: [true, 'Type is required.'],
        trim: true,
        minlength: [2, 'Type must be at least 2 characters long.']
    },
    images: [
        {
            type: String,
            required: [true, 'Image URL is required.']
        }
    ],
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price must be a positive number.']
    },
    title: {
        type: String,
        required: [true, 'Title is required.'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters long.']
    },
    subtitle: {
        type: String,
        required: [true, 'Subtitle is required.'],
        trim: true,
        minlength: [2, 'Subtitle must be at least 2 characters long.']
    },
    location: {
        type: String,
        required: [true, 'Location is required.'],
        trim: true,
        minlength: [2, 'Location must be at least 2 characters long.']
    },
    guests: {
        type: Number,
        required: [true, 'Guests is required.'],
        min: [1, 'Guest must be a positive number.']
    },
    features: [
        {
            type: String,
            required: [true, 'Feature is required.'],
            trim: true,
            minlength: [2, 'Feature must be at least 2 characters long.']
        }
    ],
    // Renamed from `available` to `availability` to match what the
    // frontend (ApartmentCard / ApartmentDetailPage) actually reads.
    availability: {
        type: Boolean,
        default: true
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
        required: [true, 'Description is required.'],
        trim: true
    }
}, {
    timestamps: true,
});

schema.index({ createdAt: -1 }, { background: true });
schema.index({ updatedAt: -1 }, { background: true });

const Apartment = model('Apartment', schema);

module.exports = Apartment;