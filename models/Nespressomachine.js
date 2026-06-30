const { model, Schema } = require("mongoose");

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true
    },
    tagline: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price must be a positive number.']
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dgpbjp2wz/image/upload/v1782762409/wmremove-transformed_xepijo.jpg',
        // required: [true, 'Image URL is required.']
    }
}, { timestamps: true });

schema.index({ createdAt: -1 }, { background: true });

const NespressoMachine = model('NespressoMachine', schema);

module.exports = NespressoMachine;