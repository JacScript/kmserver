const { model, Schema } = require("mongoose");

const schema = new Schema({
    heading: {
        type: String,
        trim: true,
        default: "Our Gallery"
    },
    stats: {
        type: [
            {
                value: { type: String, required: [true, 'Stat value is required.'], trim: true },
                label: { type: String, required: [true, 'Stat label is required.'], trim: true }
            }
        ],
        default: [
            { value: "150+", label: "Photos Captured" },
            { value: "25+", label: "Gallery Collections" },
            { value: "5", label: "Years Experience" }
        ]
    }
}, { timestamps: true });

schema.index({ createdAt: -1 }, { background: true });

const GalleryPage = model('GalleryPage', schema);

module.exports = GalleryPage;