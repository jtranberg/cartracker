const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Assuming Post model is used for storing items

// GET route to fetch items
router.get('/', async (req, res) => {
  const { dbKey, dbLock, isAdmin } = req.query;

  // Check if dbKey is provided
  if (!dbKey) {
    return res.status(400).json({ message: 'Database key is required' });
  }

  try {
    const filter = { databaseKey: dbKey };

    // Admin access requires dbLock
    if (isAdmin === 'true' && !dbLock) {
      return res.status(400).json({ message: 'Database lock is required for admin access' });
    } else if (isAdmin === 'true') {
      filter.databaseLock = dbLock;
    }

    const items = await Post.find(filter);

    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found for the given key/lock' });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

// POST route for creating a new item with lock and key
router.post('/', async (req, res) => {
  const { itemName, category, status, location, databaseKey, databaseLock, createdBy, userEmail } = req.body;

  // Ensure all required fields are provided
  if (!itemName || !category || !databaseKey || !databaseLock || !createdBy || !userEmail) {
    return res.status(400).json({ message: 'Item name, category, database key, database lock, username, and email are required' });
  }

  try {
    const newItem = new Post({
      itemName,
      category,
      status,
      location,
      createdAt: new Date(),
      databaseKey,
      databaseLock,
      isSelected: false,
      toggledBy: '',
      createdBy, // Save the username of the creator
      userEmail  // Save the email of the creator
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Failed to create item' });
  }
});

// PUT route to toggle item selected/unselected
router.put('/:id/toggle-selected', async (req, res) => {
  const itemId = req.params.id;
  const { user, isAdmin } = req.body;

  try {
    const item = await Post.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Admin toggle logic: Admins can toggle items on and off
    if (isAdmin) {
      item.isSelected = !item.isSelected;
      item.toggledBy = item.isSelected ? user : null;
    } else {
      // User toggle logic: Users can only select items that are not selected by someone else
      if (item.isSelected && item.toggledBy !== user) {
        return res.status(403).json({ message: `This item is already selected by ${item.toggledBy}.` });
      }

      // Allow the same user to unselect their own selected item
      if (item.isSelected && item.toggledBy === user) {
        item.isSelected = false;
        item.toggledBy = null; // Clear the 'toggledBy' field
      } else if (!item.isSelected) {
        // Select the item and lock it to the user
        item.isSelected = true;
        item.toggledBy = user;
      }
    }

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    console.error('Error toggling item selected state:', error);
    res.status(500).json({ message: 'Failed to toggle item selected state' });
  }
});

// POST request to send untoggle request to the admin
router.post('/:id/request-untoggle', async (req, res) => {
  const itemId = req.params.id;
  const { user } = req.body;

  try {
    const item = await Post.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure the item has been selected by the user before sending an untoggle request
    if (item.toggledBy !== user) {
      return res.status(403).json({ message: 'You are not authorized to request untoggle for this item.' });
    }

    // Mark the untoggle request and log the user who requested it
    item.pendingUntoggleRequest = true;
    item.requestedBy = user;

    await item.save(); // Save the updated item in the database
    res.status(200).json(item); // Return the updated item with the pendingUntoggleRequest flag
  } catch (error) {
    console.error('Error sending untoggle request:', error);
    res.status(500).json({ message: 'Failed to send untoggle request.' });
  }
});

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

module.exports = router;
