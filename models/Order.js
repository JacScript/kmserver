const { model, Schema } = require("mongoose");

// Snapshot of a single cart line at the moment of checkout. Deliberately
// not a reference to a product document — prices/names should stay frozen
// on the order even if the underlying product changes or is deleted later.
const orderItemSchema = new Schema({
    // Optional on purpose: the frontend cart (CartContext) doesn't currently
    // tag items with a category, so this isn't enforced with a strict enum.
    productType: {
        type: String,
        trim: true,
        default: "item"
    },
    name: {
        type: String,
        required: [true, 'Item name is required.'],
        trim: true
    },
    // e.g. "Large" for a sized accessory — optional
    variant: {
        type: String,
        trim: true
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price is required.'],
        min: [0, 'Unit price must be a positive number.']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required.'],
        min: [1, 'Quantity must be at least 1.'],
        default: 1
    }
}, { _id: false });

const schema = new Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        name: {
            type: String,
            required: [true, 'Customer name is required.'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Customer phone number is required.'],
            trim: true
        },
        notes: {
            type: String,
            trim: true
        }
    },
    items: {
        type: [orderItemSchema],
        validate: {
            validator: (arr) => Array.isArray(arr) && arr.length > 0,
            message: 'An order must contain at least one item.'
        }
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    // Set once the frontend has actually opened the WhatsApp link, so you
    // can tell "created" apart from "the customer actually sent it".
    sentVia: {
        type: String,
        enum: ['whatsapp', 'none'],
        default: 'none'
    }
}, { timestamps: true });

schema.index({ createdAt: -1 }, { background: true });

const Order = model('Order', schema);

module.exports = Order;