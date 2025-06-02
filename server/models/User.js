const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  organizationKey: { type: String, default: null },

  // ✅ Add this
  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
