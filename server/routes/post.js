// Add Item Route
app.post('/api/items', async (req, res) => {
    const { itemName, category, status, location, organizationKey } = req.body;
  
    try {
      // Create a new post/item
      const newItem = new Post({
        itemName,
        category,
        status,
        location,
        organizationKey
      });
  
      await newItem.save(); // Save the item to the database
      res.status(201).json({ success: true, message: 'Item created successfully', item: newItem });
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  