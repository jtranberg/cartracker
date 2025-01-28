router.post('/', async (req, res) => {
  const { itemName, category, status, location, databaseKey, databaseLock, userName, email } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!itemName) missingFields.push('itemName');
  if (!category) missingFields.push('category');
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

