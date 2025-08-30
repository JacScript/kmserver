const { model, Schema } = require("mongoose");
// Remove this line as it's not used correctly and likely causing an error
// const { Badge } = require("lucide-react");

const schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  heroSection: {
    heading: { type: String, trim: true },
    subheading: { type: String, trim: true },
    buttonText: { type: String },
    buttonLink: { type: String },
    badge: { type: String, trim: true }, // Changed from Badge to badge (lowercase)
    backgroundImage: [
      {
        url: { type: String, required: [true, 'Background image URL is required.'] },
        title: { type: String, trim: true },
        description: { type: String, trim: true }
      }
    ] 
  },

  discoverSection: { // Fixed spelling from "descoverSection"
    heading: { type: String, trim: true },
    subheading: { type: String, trim: true },
    image: { type: String, required: [true, 'Image URL is required.'] },
    buttonText: { type: String },
    buttonLink: { type: String }
  },

  whySection: {
    title: { type: String, trim: true },
    heading: { type: String, trim: true },
    subheading: { type: String, trim: true },
    image: { type: String, required: [true, 'Image URL is required.'] },
    button1Text: { type: String },
    button1Link: { type: String },
    button2Text: { type: String },
    button2Link: { type: String }
  },

  featuredSections: [{
    title: { type: String, trim: true },
    heading: { type: String },
    subheading: { type: String, trim: true },
     backgroundImage: [
      {
        url: { type: String, required: [true, 'Background image URL is required.'] },
        title: { type: String, trim: true },
        rate: { type: Number, min: 0, max: 5 }, // Example validation
      }
    ] 
  }],
  // Your commented sections are preserved as they were
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Optional: Improve performance by indexing the timestamp fields
schema.index({ createdAt: -1 }, { background: true }); // For sorting by most recent
schema.index({ updatedAt: -1 }, { background: true }); // For detecting recent updates

// Create and export the Home model
const HomePage = model('HomePage', schema);

// Export the Home model for use in other parts of the application
module.exports = HomePage;