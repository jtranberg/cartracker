const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Add username field
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  password: { type: String, required: true },
  organizationKey: String // Assuming this is still needed
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
