const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create user profile (for new registrations or if not found)
router.post('/', auth, async (req, res) => {
  try {
    console.log('Attempting to create profile for user:', req.user.uid);
    const { firebaseUid, email, userType, name, photos, location, preferences } = req.body;

    // Check if a user with this firebaseUid already exists to prevent duplicates
    let user = await User.findOne({ firebaseUid });
    if (user) {
      console.log('User with firebaseUid', firebaseUid, 'already exists. Returning existing profile.');
      return res.status(200).json(user); // Return existing profile if found
    }

    // Create a new user
    user = new User({
      firebaseUid,
      email,
      userType: userType || 'room_seeker', // Default to room_seeker
      name: name || email?.split('@')[0] || 'New User',
      photos: photos || [],
      location: location || { city: '', area: '' },
      preferences: preferences || {
        budget: { min: 0, max: 0 },
        lifestyle: { smoking: '', pets: '', foodPreference: '', cleanlinessPreference: '' }
      },
      // Initialize other fields as empty arrays or default values
      likes: [],
      dislikes: [],
      matches: [],
      roomDetails: {},
    });

    await user.save();
    console.log('New user profile created:', { id: user._id, firebaseUid: user.firebaseUid, email: user.email });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user profile:', error.message);
    res.status(500).json({ message: 'Error creating user profile', error: error.message });
  }
});

// Get potential matches based on user type
router.get('/potential-matches', auth, async (req, res) => {
  try {
    console.log('Fetching potential matches for userId:', req.user.uid);
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      console.log('User not found in database for firebaseUid:', req.user.uid);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current user:', JSON.stringify(user, null, 2));

    const targetUserType = user.userType === 'room_seeker' ? 'room_provider' : 'room_seeker';
    console.log('Target user type for query:', targetUserType);

    // Find users of opposite type who haven't been liked or disliked
    const query = {
      _id: { $ne: user._id },
      userType: targetUserType,
      $and: [
        { _id: { $nin: user.likes || [] } }, // Ensure likes is an array
        { _id: { $nin: user.dislikes || [] } } // Ensure dislikes is an array
      ]
    };

    // Add location-based filtering if coordinates are available and valid
    if (user.profile && user.profile.location && user.profile.location.coordinates &&
        Array.isArray(user.profile.location.coordinates) && user.profile.location.coordinates.length === 2 &&
        (user.profile.location.coordinates[0] !== 0 || user.profile.location.coordinates[1] !== 0)) {
      query['profile.location'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.profile.location.coordinates
          },
          $maxDistance: 50000 // 50km radius
        }
      };
    } else {
      console.log('Location coordinates not available or invalid for user:', user.firebaseUid);
    }

    console.log('Query for potential matches:', JSON.stringify(query, null, 2));

    const potentialMatches = await User.find(query)
      .select('-password -email')
      .limit(20);

    console.log('Found potential matches count:', potentialMatches.length);
    res.json(potentialMatches);
  } catch (error) {
    console.error('Error fetching potential matches:', error.message);
    // Log the full error object for more details
    console.error('Full error object:', error);
    res.status(500).json({ message: 'Error fetching potential matches', error: error.message });
  }
});

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user.uid);
    const user = await User.findOne({ firebaseUid: req.user.uid }).select('-password');
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    console.log('Updating profile for user:', req.user.uid);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    // Directly merge fields from req.body into the user object
    // This assumes the frontend sends flattened data as per AuthContext.jsx changes
    Object.assign(user, req.body);

    // Special handling for nested objects to ensure deep merge or default values
    if (req.body.location) {
      user.location = {
        ...user.location,
        ...req.body.location,
      };
      // Ensure type and coordinates are set for location if not provided
      if (!user.location.type) user.location.type = 'Point';
      if (!user.location.coordinates) user.location.coordinates = [0, 0];
    }

    if (req.body.preferences) {
      user.preferences = {
        ...user.preferences,
        ...req.body.preferences,
      };
      // Deep merge for nested preference objects like budget, lifestyle, roommates
      if (req.body.preferences.budget) {
        user.preferences.budget = { ...user.preferences.budget, ...req.body.preferences.budget };
      }
      if (req.body.preferences.lifestyle) {
        user.preferences.lifestyle = { ...user.preferences.lifestyle, ...req.body.preferences.lifestyle };
      }
      if (req.body.preferences.roommatePreferences) {
        user.preferences.roommatePreferences = { ...user.preferences.roommatePreferences, ...req.body.preferences.roommatePreferences };
        if (req.body.preferences.roommatePreferences.ageRange) {
          user.preferences.roommatePreferences.ageRange = { ...user.preferences.roommatePreferences.ageRange, ...req.body.preferences.roommatePreferences.ageRange };
        }
      }
    }

    // Handle photos array - replace if new photos are provided
    if (req.body.photos) {
      user.photos = req.body.photos;
    }

    await user.save();
    console.log('Profile updated successfully:', {
      id: user._id,
      firebaseUid: user.firebaseUid,
      profile: user
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message,
      details: error.errors
    });
  }
});

// Like a user
router.post('/like/:userId', auth, async (req, res) => {
  try {
    console.log('User', req.user.uid, 'is trying to like user:', req.params.userId);

    const user = await User.findOne({ firebaseUid: req.user.uid }); // Find by firebaseUid
    const likedUser = await User.findById(req.params.userId);

    if (!user || !likedUser) {
      console.log('Like failed: User or likedUser not found. Current user UID:', req.user.uid, ', Liked User ID:', req.params.userId);
      return res.status(404).json({ message: 'User or liked user not found' });
    }

    console.log('Current user object:', JSON.stringify(user, null, 2));
    console.log('Liked user object:', JSON.stringify(likedUser, null, 2));

    // Check if already liked
    if (user.likes.includes(likedUser._id)) {
      return res.status(400).json({ message: 'Already liked this user.' });
    }

    // Add to likes
    user.likes = user.likes || []; // Ensure it's an array
    user.likes.push(likedUser._id);
    await user.save();
    console.log('User', user.firebaseUid, 'successfully liked', likedUser._id);

    // Check if it's a match
    likedUser.likes = likedUser.likes || []; // Ensure it's an array
    if (likedUser.likes.includes(user._id)) {
      user.matches = user.matches || []; // Ensure it's an array
      likedUser.matches = likedUser.matches || []; // Ensure it's an array

      user.matches.push(likedUser._id);
      likedUser.matches.push(user._id);
      await likedUser.save();
      await user.save();
      console.log('MATCH! User', user.firebaseUid, 'matched with', likedUser._id);

      // Emit match event through socket.io (assuming io is available)
      if (req.app.get('io')) {
        req.app.get('io').emit('newMatch', {
          users: [user._id, likedUser._id],
          user1Name: user.profile?.name || user.email,
          user2Name: likedUser.profile?.name || likedUser.email,
        });
      }
      
      return res.json({ message: 'It\'s a match!', isMatch: true });
    }

    res.json({ message: 'Like recorded', isMatch: false });
  } catch (error) {
    console.error('Error processing like for user', req.user.uid, 'and liked user', req.params.userId, ':', error.message);
    console.error('Full error object during like:', error);
    res.status(500).json({ message: 'Error processing like', error: error.message });
  }
});

// Dislike a user
router.post('/dislike/:userId', auth, async (req, res) => {
  try {
    console.log('User', req.user.uid, 'is trying to dislike user:', req.params.userId);
    const user = await User.findOne({ firebaseUid: req.user.uid }); // Find by firebaseUid
    if (!user) {
      console.log('Dislike failed: Current user not found. User UID:', req.user.uid);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already disliked
    if (user.dislikes.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already disliked this user.' });
    }

    user.dislikes.push(req.params.userId);
    await user.save();
    console.log('User', user.firebaseUid, 'successfully disliked', req.params.userId);

    res.json({ message: 'Dislike recorded' });
  } catch (error) {
    console.error('Error processing dislike for user', req.user.uid, 'and disliked user', req.params.userId, ':', error.message);
    console.error('Full error object during dislike:', error);
    res.status(500).json({ message: 'Error processing dislike', error: error.message });
  }
});

// Get user matches
router.get('/matches', auth, async (req, res) => {
  try {
    console.log('Fetching matches for userId:', req.user.uid);
    const user = await User.findOne({ firebaseUid: req.user.uid })
      .populate('matches', '-password -email');
    
    if (!user) {
      console.log('Matches fetch failed: User not found for firebaseUid:', req.user.uid);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found matches for user', req.user.uid, ':', JSON.stringify(user.matches, null, 2));
    res.json(user.matches);
  } catch (error) {
    console.error('Error fetching matches for user', req.user.uid, ':', error.message);
    console.error('Full error object during matches fetch:', error);
    res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
});

module.exports = router; 