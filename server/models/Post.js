const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  status: String,
  location: String,
  createdAt: { type: Date, default: Date.now }, // Set a default value for createdAt
  databaseKey: String, // Existing key field
  databaseLock: String, // New lock field
  isSelected: { type: Boolean, default: false },
  toggledBy: { type: String, default: '' }, // Field to store the user who toggled
  isHidden: { type: Boolean, default: false }, // New field to track if the item is hidden
  lockedBy: String, // Add lockedBy field to store the user who locked the item
  requests: [String], // Array to store usernames of those requesting untoggle
  creatorEmail: { type: String, required: true }, // Add creatorEmail field to store the email of the user who created the item
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
