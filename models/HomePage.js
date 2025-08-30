const { model, Schema } = require("mongoose");

const schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: "Home"
  },
  heroSection: {
    heading: { 
      type: String, 
      trim: true, 
      default: "from Tanzania to France" 
    },
    subheading: { 
      type: String, 
      trim: true, 
      default: "your personalized holiday from Tanzania to France organized by Kai" 
    },
    buttonText: { 
      type: String, 
      default: "Find out more" 
    },
    buttonLink: { 
      type: String, 
      default: "/about-us" 
    },
    badge: { 
      type: String, 
      trim: true, 
      default: "Travel and tours" 
    },
    backgroundImage: {
      type: [{
        url: { 
          type: String, 
          required: [true, 'Background image URL is required.'] 
        },
        title: { 
          type: String, 
          trim: true 
        },
        description: { 
          type: String, 
          trim: true 
        }
      }],
      default: [
        {
          url: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750387303/img4_qxdha0.jpg",
          title: "Slide 1",
          description: "Description for Slide 1"
        },
        {
          url: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750398584/img1_hcxvl6.jpg",
          title: "Slide 2",
          description: "Description for Slide 2"
        }
      ]
    }
  },

  discoverSection: {
    heading: { 
      type: String, 
      trim: true, 
      default: "Explore Paris, and the neighbouring EU cities with Kai and KM travel and tours" 
    },
    subheading: { 
      type: String, 
      trim: true, 
      default: "Kai specialises in guiding Tanzanians through unforgettable journeys across France and neighboring EU cities, offering full support from visa application to local experiences that feel like home never missing a spot" 
    },
    image: { 
      type: String, 
      required: [true, 'Image URL is required.'], 
      default: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750388539/img19_peizvu.jpg" 
    },
    buttonText: { 
      type: String, 
      default: "Contact us" 
    },
    buttonLink: { 
      type: String, 
      default: "#homecontact" 
    }
  },

  whySection: {
    title: { 
      type: String, 
      trim: true, 
      default: "TIMELESS ADVENTURE" 
    },
    heading: { 
      type: String, 
      trim: true, 
      default: "WHY CHOOSE KM TRAVEL AND TOUR" 
    },
    subheading: { 
      type: String, 
      trim: true, 
      default: "At KM Travel & Tours, you're not just booking a trip, your travel is being organised by someone who understands your journey. Kai Maembe, Tanzanian-born and raised, has lived in France for over 7 years and is an active member of the diaspora community in France. With firsthand experience living, working, and studying across France, Scandinavia, and other EU cities, Kai brings unmatched insight into what Tanzanian travelers truly need abroad.Fluent in Swahili, English, and French, Kai offers warm, personalized support from the moment you start your visa process to the day you land in Europe. Whether it's your first international trip or your fifth, KM Travel & Tours makes you feel informed, prepared, and right at home anywhere in Europe.From Tanzania to Europe—travel confidently, travel with Kai." 
    },
    image: { 
      type: String, 
      required: [true, 'Image URL is required.'], 
      default: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750389279/img11_rlgher.jpg" 
    },
    buttonText: { 
      type: String, 
      default: "Contact Us" 
    },
    buttonLink: { 
      type: String, 
      default: "#homecontact" 
    }
  },

  featuredSections: {
    title: { 
      type: String, 
      trim: true, 
      default: "Feature Tour" 
    },
    heading: { 
      type: String, 
      default: "Feature Tour" 
    },
    subheading: { 
      type: String, 
      trim: true, 
      default: "Discover breathtaking destinations and create unforgettable memories with our curated tour experiences." 
    },
    backgroundImage: {
      type: [{
        url: { 
          type: String, 
          required: [true, 'Background image URL is required.'] 
        },
        title: { 
          type: String, 
          trim: true 
        },
        rate: { 
          type: Number, 
          min: 0, 
          max: 5 
        }
      }],
      default: [
        {
          url: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750390239/brussels_nhf7b5.jpg",
          title: "Brussels",
          rate: 4
        },
        {
          url: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750390258/Barcelona_iatvqy.jpg",
          title: "Barcelona",
          rate: 4
        },
        {
          url: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750390302/Amsterdam_wmh0so.jpg",
          title: "Amsterdam",
          rate: 5
        },
        {
          url: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750389829/Rome_dxqkym.jpg",
          title: "Rome",
          rate: 5
        },
        {
          url: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750391426/greece_gnihsm.jpg",
          title: "greece",
          rate: 5
        },
        {
          url: "https://res.cloudinary.com/dwkivuqts/image/upload/v1750389808/Berlin_bu6hcd.jpg",
          title: "Berlin",
          rate: 4
        }
      ]
    }
  }
}, { timestamps: true });

// Optional: Improve performance by indexing the timestamp fields
schema.index({ createdAt: -1 }, { background: true }); // For sorting by most recent
schema.index({ updatedAt: -1 }, { background: true }); // For detecting recent updates

// Create and export the Home model
const HomePage = model('HomePage', schema);

// Export the Home model for use in other parts of the application
module.exports = HomePage;