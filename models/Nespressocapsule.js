const { model, Schema } = require("mongoose");

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true
    },
    intensity: {
        type: Number,
        required: [true, 'Intensity is required.'],
        min: [1, 'Intensity must be at least 1.'],
        max: [13, 'Intensity cannot exceed 13.']
    },
    // e.g. ["Espresso (40ml)", "Lungo (110ml)"]
    servings: [
        {
            type: String,
            trim: true
        }
    ],
    image: {
        type: String,
        // required: [true, 'Image URL is required.'],
        default: "https://res.cloudinary.com/dgpbjp2wz/image/upload/v1782762409/wmremove-transformed_xepijo.jpg"
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price must be a positive number.']
    }
}, { timestamps: true });

schema.index({ createdAt: -1 }, { background: true });

const NespressoCapsule = model('NespressoCapsule', schema);

module.exports = NespressoCapsule;