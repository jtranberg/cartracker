const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  status: String,
  location: String,
  databaseKey: String,
  databaseLock: String,
  userName: String, // Change from createdBy to userName
  email: String,
  isSelected: { type: Boolean, default: false },
  toggledBy: { type: String, default: null },
  isHidden: { type: Boolean, default: false },
});


module.exports = mongoose.model('Post', postSchema);
