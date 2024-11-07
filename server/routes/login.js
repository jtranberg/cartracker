const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // Enable CORS
require('dotenv').config();

const app = express();

// Enable CORS to allow cross-origin requests
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Define user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  organizations: Array  // Store multiple organizations for the user
});

const User = mongoose.model('User', userSchema);

// Define the /login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ success: false, message: 'Invalid credentials' });
    }

    // If successful, send back the user's organizations list
    res.json({ success: true, organizations: user.organizations, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
