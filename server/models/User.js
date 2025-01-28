const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true }, // Trim whitespaces for cleanliness
  email: { type: String, required: true, unique: true, index: true, trim: true }, // Unique and indexed
  password: { type: String, required: true, minlength: 8 }, // Minimum length for security
  organizationKey: { type: String, default: null } // Optional, with a default of null
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
