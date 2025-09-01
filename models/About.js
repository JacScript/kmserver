const { Schema, model, moongose } = require("mongoose");

const schema = new Schema({
    mainContent:{
        image:{type : String, required: true},
        title: {type: String, required: true , trim: true},
        description: {type: String, required: true , trim: true},
        subdescription: {type: String, required: true , trim: true},
        phoneNumber: {
  type: String,
  required: true,
  trim: true,
  match: [/^\+?[0-9\s-]+$/, "Please provide a valid phone number"]
}

    },

    whoweareSection:{
        title: {type: String, required: true , trim: true},
        service:[{

            title: {type: String, required: true , trim: true},
            description: {type: String, required: true , trim: true},
        }
        ],
        bottomtext: {type: String, required: true , trim: true},
    },

    valueSection:[{
        title: {type: String, required: true , trim: true},
        description: {type: String, required: true , trim: true},
        
    }],
 
},{
    timestamps: true, // Automatically includes createdAt and updatedAt 
});

// Optional: Improve performance by indexing the timestamp fields
schema.index({ createdAt: -1 }, { background: true }); // For sorting by most recent
schema.index({ updatedAt: -1 }, { background: true }); // For detecting recent updates

// Create and export the Home model
const About = model('About', schema);

// Export the Home model for use in other parts of the application
module.exports = About;

