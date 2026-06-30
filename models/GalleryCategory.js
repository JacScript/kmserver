const { model, Schema } = require("mongoose");

// The filter buttons shown above the gallery grid. Kept separate from
// Photo so a category's display label can be renamed (or a missing one
// added — see the "brussels" gap in the original frontend data) without
// having to touch every photo tagged with it.
const schema = new Schema({
    // The value actually stored on each Photo's `category` field, e.g. "paris"
    slug: {
        type: String,
        required: [true, 'Category slug is required.'],
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [2, 'Slug must be at least 2 characters long.']
    },
    // The text shown on the filter button, e.g. "France" for slug "paris"
    label: {
        type: String,
        required: [true, 'Category label is required.'],
        trim: true
    },
    icon: {
        type: String,
        trim: true
    },
    // Controls left-to-right order of the filter buttons
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

schema.index({ order: 1 });

const GalleryCategory = model('GalleryCategory', schema);

module.exports = GalleryCategory;