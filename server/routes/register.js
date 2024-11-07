app.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ success: false, message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user without any organizations initially
      const newUser = new User({
        email,
        password: hashedPassword,
        organizations: []  // Empty array initially; user can add organizations later
      });
  
      await newUser.save();
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  });
  