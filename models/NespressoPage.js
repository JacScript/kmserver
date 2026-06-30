const { model, Schema } = require("mongoose");

// Page content for /nespresso. Mirrors the HolidayHomePage pattern: the
// page itself holds its own copy, and references which products to show
// (by ID) rather than duplicating product data here.
const schema = new Schema({
    heroSection: {
        eyebrow: {
            type: String,
            trim: true,
            default: "Nespresso"
        },
        title: {
            type: String,
            trim: true,
            default: "Crafted for the ritual of coffee."
        },
        subheading: {
            type: String,
            trim: true,
            default: "Discover machines engineered for precision and capsules sourced from the world's finest coffee farms."
        },
        backgroundImage: {
            type: [String],
            default: []
        }
    },

    machinesSection: {
        eyebrow: {
            type: String,
            trim: true,
            default: "Machines"
        },
        heading: {
            type: String,
            trim: true,
            default: "Designed to fit your kitchen, built to fit your ritual."
        }
    },

    capsulesSection: {
        eyebrow: {
            type: String,
            trim: true,
            default: "Capsules"
        },
        heading: {
            type: String,
            trim: true,
            default: "A world of coffee, one capsule at a time."
        },
        subheading: {
            type: String,
            trim: true,
            default: "From bold Ristretto to delicate Hawaii Kona, each blend is roasted and sealed at peak freshness, capturing the aroma of single-origin farms in every cup."
        }
    },

    accessoriesSection: {
        eyebrow: {
            type: String,
            trim: true,
            default: "Accessories"
        },
        heading: {
            type: String,
            trim: true,
            default: "Everything else for the ritual."
        },
        subheading: {
            type: String,
            trim: true,
            default: "Pick a size, add it to your cart — or message us for anything that isn't listed here yet."
        }
    },

    sustainabilitySection: {
        heading: {
            type: String,
            trim: true,
            default: "Good coffee should be good for the planet too."
        },
        subheading: {
            type: String,
            trim: true
        },
        stats: [
            {
                value: {
                    type: String,
                    required: [true, 'Stat value is required.'],
                    trim: true
                },
                label: {
                    type: String,
                    required: [true, 'Stat label is required.'],
                    trim: true
                }
            }
        ]
    },

    clubSection: {
        heading: {
            type: String,
            trim: true,
            default: "Membership that brews more than coffee."
        },
        perks: [
            {
                title: {
                    type: String,
                    required: [true, 'Perk title is required.'],
                    trim: true
                },
                description: {
                    type: String,
                    required: [true, 'Perk description is required.'],
                    trim: true
                }
            }
        ]
    },

    // Curated, ordered lists — linked by reference, populate() to expand.
    machines: [{ type: Schema.Types.ObjectId, ref: 'NespressoMachine' }],
    capsules: [{ type: Schema.Types.ObjectId, ref: 'NespressoCapsule' }],
    accessories: [{ type: Schema.Types.ObjectId, ref: 'NespressoAccessory' }]
}, { timestamps: true });

schema.index({ createdAt: -1 }, { background: true });

const NespressoPage = model('NespressoPage', schema);

module.exports = NespressoPage;