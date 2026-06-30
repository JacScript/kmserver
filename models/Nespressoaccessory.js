const { model, Schema } = require("mongoose");

const sizeSchema = new Schema({
    label: {
        type: String,
        required: [true, 'Size label is required.'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price must be a positive number.']
    }
}, { _id: false });

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    // Optional — "available on demand" items (cleaning kits, capsule
    // storage) may not have a product photo yet.
    image: {
        type: String,
        default: "https://res.cloudinary.com/dgpbjp2wz/image/upload/v1782762409/wmremove-transformed_xepijo.jpg"
    },
    // Empty sizes array = no fixed pricing, i.e. "available on demand".
    sizes: [sizeSchema],
    onDemand: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

schema.index({ createdAt: -1 }, { background: true });

const NespressoAccessory = model('NespressoAccessory', schema);

module.exports = NespressoAccessory;