const { model, Schema } = require("mongoose");

// Define the schema for the Request model
const requestSchema = new Schema({
  // Destination of the request (e.g., specific country, city, or region)
  destination: {
    type: String,
    required: [true, 'Destination is required.'], // Added custom error message
    trim: true, // Trim whitespace from the beginning and end of the string
    minlength: [2, 'Destination must be at least 2 characters long.'] // Example validation
  },
  // Specific activity related to the request (e.g., visa application, tour booking)
  activity: {
    type: String,
    required: [true, 'Activity is required.'], // Added custom error message
    trim: true,
    minlength: [2, 'Activity must be at least 2 characters long.'] // Example validation
  },
  // Date associated with the request (e.g., desired travel date, submission date)
//   date: {
//     type: Date,
//     required: [true, 'Date is required.'], // Added custom error message
//     // You might add custom validation here to ensure the date is in the future
//     // validate: {
//     //   validator: function(v) {
//     //     return v >= new Date(); // Date must be now or in the future
//     //   },
//     //   message: props => `${props.value} must be a future date!`
//     // }
//   },
  // Email of the person making the request
  email: {
    type: String,
    required: [true, 'Email is required.'], // Added custom error message
    trim: true,
    lowercase: true, // Store emails in lowercase to avoid case sensitivity issues
    unique: false, // Set to true if each email can only make one unique request (unlikely for requests)
    // Regex for basic email validation (more robust validation might be done on frontend or with a library)
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
}, {
  timestamps: true, // Mongoose automatically adds `createdAt` and `updatedAt` fields
  collection: 'requests' // Optional: Explicitly define the collection name
});

// --- Schema Enhancements and Best Practices ---

// 1. Indexing for Query Performance:
//    Indexes significantly speed up queries on the indexed fields.
//    `createdAt: -1` allows for efficient sorting by most recent requests.
//    `updatedAt: -1` helps in querying recently modified requests.
//    `background: true` builds the index in the background without blocking other database operations.
requestSchema.index({ createdAt: -1 }, { background: true });
requestSchema.index({ updatedAt: -1 }, { background: true });

// 2. Pre/Post Hooks (Optional, for future use):
//    You can add pre or post middleware hooks for actions like data validation,
//    hashing passwords (if this model were for users), or logging.
//    Example: Before saving, if you needed to transform data
// requestSchema.pre('save', async function(next) {
//   console.log('Pre-save hook: Preparing to save a request');
//   next();
// });

// 3. Virtuals (Optional, for future use):
//    Virtual properties don't get stored in MongoDB. They're useful for
//    computed properties that derive their value from other properties.
// requestSchema.virtual('requestDetails').get(function() {
//   return `${this.activity} for ${this.destination} on ${this.date.toDateString()}`;
// });

// --- Model Creation ---

// Create the Mongoose model from the schema.
// The first argument is the singular name of the collection your model is for.
// Mongoose automatically looks for the plural, lowercased version of your model name.
// So, 'Request' will map to the 'requests' collection in MongoDB.
const Request = model('Request', requestSchema);

// Export the Request model to be used in other parts of the application (e.g., controllers, routes)
module.exports = Request;