const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();
const itemsRouter = require('./api/items'); // Your item routes

const app = express();

// Use the correct CORS configuration
app.use(cors({
  origin: [
    'https://igotit-t2uz.onrender.com', 
    'http://localhost:8081',
    'http://localhost:5000',
    'http://10.0.0.167:5000'  // Add your local machine's IP
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Use itemsRouter for item-related routes
app.use('/api/items', itemsRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request:', { email, password }); // Log incoming request data
  
    try {
      // Step 1: Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found with email:', email); // Log if user is not found
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
  
      console.log('User found:', user); // Log found user details (excluding password)
  
      // Step 2: Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password does not match for user:', email); // Log if password comparison fails
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
  
      console.log('Password matched successfully'); // Log successful password match
  
      // Step 3: Return success response
      res.status(200).json({ success: true, message: 'Login successful', username: user.username });
    } catch (error) {
      console.error('Server error:', error); // Log server errors
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

// Register Route
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
