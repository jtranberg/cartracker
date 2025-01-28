const express = require('express');
const router = express.Router(); // Initialize the router
const Post = require('../models/Post'); // Import your model

// POST route for creating a new item
router.post('/', async (req, res) => {
  console.log("Payload received in backend:", req.body); // Log payload for debugging

  const { itemName, category, status, location, databaseKey, databaseLock, userName, email } = req.body;

  // Validate all required fields
  const missingFields = [];
  if (!itemName) missingFields.push('itemName');
  if (!category) missingFields.push('category');
  if (!status) missingFields.push('status'); // Include status in validation
  if (!location) missingFields.push('location'); // Include location in validation
  if (!databaseKey) missingFields.push('databaseKey');
  if (!databaseLock) missingFields.push('databaseLock');
  if (!userName) missingFields.push('userName'); // Match frontend naming
  if (!email) missingFields.push('email');

  if (missingFields.length > 0) {
    console.error('Missing required fields:', missingFields);
    return res.status(400).json({
      message: 'Missing required fields',
      missingFields,
    });
  }

  try {
    const newItem = new Post({
      itemName,
      category,
      status: status || 'Available',
      location: location || 'Unknown',
      databaseKey,
      databaseLock,
      createdBy: userName, // Map userName to createdBy in the model
      email,
      isSelected: false,
      toggledBy: '',
      isHidden: false,
    });

    const savedItem = await newItem.save();
    console.info('New item created successfully:', savedItem);
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: savedItem,
    });
  } catch (error) {
    console.error('Validation error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ message: 'Failed to create item', error });
  }
});


// GET route for fetching items
router.get('/', async (req, res) => {
  const { dbKey, dbLock, isAdmin } = req.query;

  console.log("Received query parameters:", { dbKey, dbLock, isAdmin });

  if (!dbKey) {
    return res.status(400).json({ message: 'Database key is required' });
  }

  try {
    const filter = { databaseKey: dbKey };
    if (isAdmin === 'true') {
      if (!dbLock) {
        return res.status(400).json({ message: 'Database lock is required for admin access' });
      }
      filter.databaseLock = dbLock;
    }

    console.log("Filter applied:", filter);

    const items = await Post.find(filter);
    console.log("Items found:", items);

    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found for the given key/lock' });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});



const toggleItemSelected = async (itemId) => {
  try {
    const selectedItem = items.find((item) => item._id === itemId);

    if (!fetchDbKey || !fetchDbLock) {
      alert("Database key or lock is missing.");
      return;
    }

    const payload = {
      user: userName || 'Admin', // Use 'Admin' if userName is missing
      isAdmin: true, // Admin flag
      dbKey: fetchDbKey.trim(),
      dbLock: fetchDbLock.trim(),
    };

    console.log("Payload sent to toggle-selected API:", payload);

    const response = await axios.put(`${apiUrl}/api/items/${itemId}/toggle-selected`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Response from toggle-selected API:", response.data);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? response.data : item
      )
    );

    console.log("Updated items after toggle:", items);
  } catch (err) {
    console.error("Error toggling item:", err.response?.data || err);
    alert(err.response?.data?.message || "Failed to toggle the item.");
  }
};






// DELETE route for deleting an item
router.delete('/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await Post.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});
// PUT route for toggling item selection
router.put('/:id/toggle-selected', async (req, res) => {
  const itemId = req.params.id;
  const { user, isAdmin, dbKey, dbLock } = req.body;

  console.log("Toggle Request Received:", { itemId, user, isAdmin, dbKey, dbLock });

  try {
    // Find the item by ID
    const item = await Post.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Validate database key and lock
    if (item.databaseKey !== dbKey) {
      return res.status(403).json({ message: 'Invalid database key' });
    }

    if (isAdmin && item.databaseLock !== dbLock) {
      return res.status(403).json({ message: 'Invalid database lock for admin' });
    }

    // Admin toggle logic
    if (isAdmin) {
      console.log("Admin Toggle Logic Triggered");
      item.isSelected = !item.isSelected; // Toggle selection
      item.toggledBy = item.isSelected ? user || 'Admin' : null; // Set toggler
    } else {
      // User toggle logic
      if (item.isSelected && item.toggledBy !== user) {
        return res.status(403).json({
          message: `Item is already selected by ${item.toggledBy}.`,
        });
      }

      item.isSelected = !item.isSelected;
      item.toggledBy = item.isSelected ? user : null;
    }

    // Save the updated item
    const updatedItem = await item.save();
    console.log("Item Successfully Toggled:", updatedItem);
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error toggling item:", error);
    res.status(500).json({ message: 'Failed to toggle item', error });
  }
});


module.exports = router;
