const { model, Schema , default: mongoose} = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new Schema({
    username: {
        type: String,
        // required: true
    },
    email:{
       type: String,
       required: true,
       unique: true
    },
   
    password: {
        type: String,
        required: true
    }, 
   role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },

}, { timestamps: true });

//Method to match entered password with the hashed password in database
schema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypts password before saving if it has been modified
schema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10); // Generates a salt for hashing
    this.password = await bcrypt.hash(this.password, salt); // Hashes password
});


// Optional: Indexes for performance optimization on createdAt and updatedAt fields
schema.index({ createdAt: -1 }, { background: true });
schema.index({ updatedAt: -1 }, { background: true });

// Create the User model from the schema
const User = model('User', schema);

// Export the User model for use in other parts of the application
module.exports = User;