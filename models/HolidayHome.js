const { model, Schema } = require("mongoose");

// Define the schema for the Holiday Home landing page.
// This holds the page's own content (hero carousel + listings-section
// copy) and a curated, ordered list of which apartments to display —
// linked by reference to the Apartment collection, not duplicated here.
const schema = new Schema({
    heroSection: {
        eyebrow: {
            type: String,
            trim: true,
            default: "Entire villa · Studio · Private Room"
        },
        title: {
            type: String,
            trim: true,
            required: [true, 'Hero title is required.'],
            default: "Bahari Breeze Villa Chez Kai"
        },
        subheading: {
            type: String,
            trim: true,
            default: "Sun-bleached wood and stone walls open onto a private pool tucked behind the palms — five rooms, one unmistakable view of the coast."
        },
        images: {
            type: [
                {
                    url: { type: String, required: [true, 'Hero image URL is required.'] },
                    alt: { type: String, trim: true },
                    label: { type: String, trim: true }
                }
            ],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: 'At least one hero image is required.'
            }
        }
    },

    listingsSection: {
        badge: {
            type: String,
            trim: true,
            default: "Holiday Home"
        },
        heading: {
            type: String,
            trim: true,
            default: "Find your next stay in Dar es Salaam."
        },
        subheading: {
            type: String,
            trim: true,
            default: "Hand-picked apartments, fully furnished and ready whenever you are."
        },
        // Curated, ordered list of apartments shown on this page.
        // Linked by ObjectId reference — populate() this field to get
        // the full Apartment documents back.
        apartments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Apartment'
            }
        ]
    }
}, {
    timestamps: true,
});

schema.index({ createdAt: -1 }, { background: true });
schema.index({ updatedAt: -1 }, { background: true });

const HolidayHomePage = model('HolidayHomePage', schema);

module.exports = HolidayHomePage;