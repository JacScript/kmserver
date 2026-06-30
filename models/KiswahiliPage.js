const { model, Schema } = require("mongoose");

// Define the schema for the Kiswahili Institute landing page (singleton,
// same pattern as About/HomePage).
const schema = new Schema({
    heroSection: {
        badge: {
            type: String,
            trim: true,
            default: "Learn Swahili"
        },
        heading: {
            type: String,
            trim: true,
            required: [true, 'Hero heading is required.'],
            default: "Karibu kwenye ulimwengu"
        },
        // The orange-highlighted word(s) on the second heading line,
        // e.g. "Kiswahili" in "wa Kiswahili"
        headingAccent: {
            type: String,
            trim: true,
            default: "Kiswahili"
        },
        headingAccentPrefix: {
            type: String,
            trim: true,
            default: "wa"
        },
        subheading: {
            type: String,
            trim: true,
            default: "Welcome to the world of Swahili"
        },
        description: {
            type: String,
            trim: true,
            default: "Embark on an incredible journey to master East Africa's most beautiful language. Our interactive lessons make learning Swahili engaging, practical, and fun."
        },
        buttonText: {
            type: String,
            trim: true,
            default: "Anza Kusoma - Start Learning"
        },
        buttonLink: {
            type: String,
            trim: true,
            default: "#enroll"
        },
        backgroundImage: [{
            type: String,
            required: [true, 'Hero background image URL is required.']
        }]
    },

    featuresSection: {
        features: {
            type: [
                {
                    icon: { type: String, trim: true }, // e.g. "user", "settings", "bar-chart"
                    title: {
                        type: String,
                        required: [true, 'Feature title is required.'],
                        trim: true
                    },
                    description: {
                        type: String,
                        required: [true, 'Feature description is required.'],
                        trim: true
                    },
                    buttonText: {
                        type: String,
                        trim: true,
                        default: "Get Started"
                    },
                    buttonLink: {
                        type: String,
                        trim: true
                    },
                    backgroundImage: {
                        type: String,
                        required: [true, 'Feature image URL is required.']
                    }
                }
            ],
            default: [
                {
                    icon: "user",
                    title: "Interactive Lessons",
                    description: "Designed to be interactive, involving the user actively through speaking, listening, reading, and writing exercises.",
                    buttonText: "Get Started",
                    backgroundImage: ""
                },
                {
                    icon: "settings",
                    title: "Personalized Learning",
                    description: "Tailor-made learning paths are created based on the user's proficiency level, goals, and learning pace.",
                    buttonText: "Get Started",
                    backgroundImage: ""
                },
                {
                    icon: "bar-chart",
                    title: "Progress Tracking",
                    description: "We offer detailed insights and analytics on performance, highlighting strengths and areas for improvement.",
                    buttonText: "Get Started",
                    backgroundImage: ""
                }
            ]
        }
    },

    masterySection: {
        // Rendered as 3 separate lines, each its own color/weight on the
        // frontend, e.g. "Master" / "Swahili in" / "30 days"
        headingLines: {
            type: [String],
            default: ["Master", "Swahili in", "30 days"]
        },
        description: {
            type: String,
            trim: true,
            default: "Revolutionary learning system designed by language experts and cognitive scientists. Experience immersive, AI-powered lessons that adapt to your pace."
        },
        stats: {
            type: [
                {
                    value: { type: String, required: [true, 'Stat value is required.'], trim: true },
                    label: { type: String, required: [true, 'Stat label is required.'], trim: true }
                }
            ],
            default: [
                { value: "100", label: "Active Learners" },
                { value: "95%", label: "Success Rate" },
                { value: "30", label: "Days Average" }
            ]
        },
        levels: {
            type: [
                {
                    title: { type: String, required: [true, 'Level title is required.'], trim: true },
                    subtitle: { type: String, trim: true }
                }
            ],
            default: [
                { title: "Kiswahili", subtitle: "Beginner Level" },
                { title: "Kiswahili", subtitle: "Intermediate Level" },
                { title: "Kiswahili", subtitle: "Advanced Level" }
            ]
        },
        benefits: {
            type: [
                {
                    icon: { type: String, trim: true }, // e.g. "users", "globe", "zap", "book-open"
                    text: { type: String, required: [true, 'Benefit text is required.'], trim: true }
                }
            ],
            default: [
                { icon: "users", text: "Learn from native speakers" },
                { icon: "globe", text: "Network with global speakers" },
                { icon: "zap", text: "Personalized learning experience" },
                { icon: "book-open", text: "Interactive lessons & practice" }
            ]
        },
        buttonText: {
            type: String,
            trim: true,
            default: "Get Started"
        },
        buttonLink: {
            type: String,
            trim: true,
            default: "#enroll"
        }
    },

    ctaSection: {
        badge: {
            type: String,
            trim: true,
            default: "Enroll Today"
        },
        heading: {
            type: String,
            trim: true,
            default: "Ready to embark on your language learning adventure?"
        },
        description: {
            type: String,
            trim: true,
            default: "Dive into a world where language isn't just a skill—it's an adventure. Our expert instructors, engaging multimedia resources, and interactive sessions are here to guide you through a path that's both enriching and enjoyable."
        },
        buttonText: {
            type: String,
            trim: true,
            default: "Enroll Now"
        },
        buttonLink: {
            type: String,
            trim: true,
            default: "#enroll"
        },
        image: {
            type: String // the mascot/illustration graphic
        }
    }
}, {
    timestamps: true,
});

schema.index({ createdAt: -1 }, { background: true });
schema.index({ updatedAt: -1 }, { background: true });

const KiswahiliPage = model('KiswahiliPage', schema);

module.exports = KiswahiliPage;