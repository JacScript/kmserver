// models/Package.js
const { model, Schema } = require('mongoose');

const schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  // Optional: Uncomment if you add duration
  duration: {
    type: String,
    trim: true,
  },
  price: {
    type: Number, // String in case price includes commas or symbols
    required: true,
    // trim: true,
  },
  priceNote: {
    type: String,
    trim: true,
    default: '/person',
  },
  images: [{
    type: String,
    trim: true,
  }],
  description: {
    type: String,
    required: true,
    trim: true,
  },
  longDescription: {
    type: String,
    trim: true,
  },
  features: [{
    type: String,
    trim: true,
  }],
  color: {
    type: String,
    default: "from-red-500 to-orange-500"
  },
  bgColor: {
    type: String,
    default: "bg-red-50"
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
//   type: {
//     type: String,
//     enum: ['pilgrimage', 'adventure', 'safari', 'holiday', 'honeymoon'],
//     default: 'pilgrimage',
//   },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Indexing for better performance on date queries
schema.index({ createdAt: -1 }, { background: true });
schema.index({ updatedAt: -1 }, { background: true });

// Optional: update updatedAt manually if needed (timestamps usually handles it)
schema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Package = model('Package', schema);
module.exports = Package;
