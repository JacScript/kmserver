const { model, Schema } = require("mongoose");

const schema = new Schema({
    src: {
        type: String,
        required: [true, 'Photo URL is required.']
    },
    alt: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required.'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    // Matches a GalleryCategory's slug (e.g. "paris", "rome", "brussels").
    // Loosely coupled by value rather than an ObjectId ref — a photo
    // doesn't break if a category's label gets renamed, and this isn't
    // validated against GalleryCategory at save-time on purpose, so photos
    // can be tagged ahead of a category being created if needed.
    category: {
        type: String,
        required: [true, 'Category is required.'],
        trim: true,
        lowercase: true
    },
    // Drives the masonry grid's column-span on the frontend
    size: {
        type: String,
        enum: ['small', 'medium', 'large', 'wide'],
        default: 'medium'
    },
    // Manual sort order within the grid; falls back to newest-first
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

schema.index({ category: 1 });
schema.index({ order: 1 });
schema.index({ createdAt: -1 }, { background: true });

const Photo = model('Photo', schema);

module.exports = Photo;