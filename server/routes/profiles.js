const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create user profile (for new registrations or if not found)
router.post('/', auth, async (req, res) => {
  try {
    console.log('Attempting to create profile for user:', req.user.uid);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Check if a user with this firebaseUid already exists to prevent duplicates
    let user = await User.findOne({ firebaseUid: req.user.uid });
    if (user) {
      console.log('User with firebaseUid', req.user.uid, 'already exists. Returning existing profile.');
      return res.status(200).json(user); // Return existing profile if found
    }

    // Create a new user with the provided data
    user = new User({
      firebaseUid: req.user.uid,
      email: req.body.email,
      userType: req.body.userType || 'room_seeker',
      name: req.body.name || req.body.email?.split('@')[0] || 'New User',
      profile: {
        photos: req.body.profile?.photos || [],
        location: {
          type: 'Point',
          coordinates: req.body.profile?.location?.coordinates || [0, 0],
          city: req.body.profile?.location?.city || '',
          area: req.body.profile?.location?.area || ''
        },
        preferences: {
          budget: {
            min: req.body.profile?.preferences?.budget?.min || 0,
            max: req.body.profile?.preferences?.budget?.max || 0
          },
          roommates: {
            gender: req.body.profile?.preferences?.roommates?.gender || 'any',
            ageRange: {
              min: req.body.profile?.preferences?.roommates?.ageRange?.min || 18,
              max: req.body.profile?.preferences?.roommates?.ageRange?.max || 99
            }
          },
          lifestyle: {
            cleanliness: req.body.profile?.preferences?.lifestyle?.cleanliness || 5,
            socialLevel: req.body.profile?.preferences?.lifestyle?.socialLevel || 5,
            workMode: req.body.profile?.preferences?.lifestyle?.workMode || 'office',
            smoking: req.body.profile?.preferences?.lifestyle?.smoking || 'no',
            pets: req.body.profile?.preferences?.lifestyle?.pets || 'no',
            foodPreference: req.body.profile?.preferences?.lifestyle?.foodPreference || 'any'
          }
        }
      },
      // Initialize other fields as empty arrays or default values
      likes: [],
      dislikes: [],
      matches: [],
      roomDetails: {},
      onboarded: false
    });

    console.log('Creating new user with data:', JSON.stringify(user, null, 2));
    await user.save();
    console.log('New user profile created successfully:', { id: user._id, firebaseUid: user.firebaseUid, email: user.email });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user profile:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      message: 'Error creating user profile', 
      error: error.message,
      details: error.errors // Include validation errors if any
    });
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

    // Handle profile updates
    if (req.body.profile) {
      // Update basic profile fields
      if (req.body.profile.age) user.profile.age = parseInt(req.body.profile.age);
      if (req.body.profile.gender) user.profile.gender = req.body.profile.gender;
      if (req.body.profile.occupation) user.profile.occupation = req.body.profile.occupation;
      if (req.body.profile.bio) user.profile.bio = req.body.profile.bio;
      if (req.body.profile.interests) user.profile.interests = req.body.profile.interests;
      if (req.body.profile.photos) user.profile.photos = req.body.profile.photos;

      // Handle location
      if (req.body.profile.location) {
        user.profile.location = {
          type: 'Point',
          coordinates: req.body.profile.location.coordinates || [0, 0],
          city: req.body.profile.location.city,
          area: req.body.profile.location.area
        };
      }

      // Handle preferences
      if (req.body.profile.preferences) {
        // Initialize preferences if they don't exist
        if (!user.profile.preferences) {
          user.profile.preferences = {
            budget: { min: 0, max: 0 },
            roommates: {
              gender: 'any',
              ageRange: { min: 18, max: 99 }
            },
            lifestyle: {
              cleanliness: 5,
              socialLevel: 5,
              workMode: 'office',
              smoking: 'no',
              pets: 'no',
              foodPreference: 'any'
            }
          };
        }

        // Handle budget preferences
        if (req.body.profile.preferences.budget) {
          user.profile.preferences.budget = {
            min: parseInt(req.body.profile.preferences.budget.min) || 0,
            max: parseInt(req.body.profile.preferences.budget.max) || 0
          };
        }

        // Handle roommate preferences
        if (req.body.profile.preferences.roommates) {
          user.profile.preferences.roommates = {
            gender: req.body.profile.preferences.roommates.gender || 'any',
            ageRange: {
              min: parseInt(req.body.profile.preferences.roommates.ageRange?.min) || 18,
              max: parseInt(req.body.profile.preferences.roommates.ageRange?.max) || 99
            }
          };
        }

        // Handle lifestyle preferences
        if (req.body.profile.preferences.lifestyle) {
          const lifestyle = req.body.profile.preferences.lifestyle;
          
          // Initialize lifestyle if it doesn't exist
          if (!user.profile.preferences.lifestyle) {
            user.profile.preferences.lifestyle = {};
          }

          user.profile.preferences.lifestyle.cleanliness = lifestyle.cleanliness !== undefined ? parseInt(lifestyle.cleanliness) : user.profile.preferences.lifestyle.cleanliness;
          user.profile.preferences.lifestyle.socialLevel = lifestyle.socialLevel !== undefined ? parseInt(lifestyle.socialLevel) : user.profile.preferences.lifestyle.socialLevel;
          user.profile.preferences.lifestyle.workMode = lifestyle.workMode || user.profile.preferences.lifestyle.workMode;
          user.profile.preferences.lifestyle.smoking = lifestyle.smoking || user.profile.preferences.lifestyle.smoking;
          user.profile.preferences.lifestyle.pets = lifestyle.pets || user.profile.preferences.lifestyle.pets;
          user.profile.preferences.lifestyle.foodPreference = lifestyle.foodPreference || user.profile.preferences.lifestyle.foodPreference;
        }
      }
    }

    // Handle top-level user fields
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.userType !== undefined) user.userType = req.body.userType;
    if (req.body.onboarded !== undefined) user.onboarded = req.body.onboarded;

    // Handle room details for room_provider
    if (req.body.roomDetails) {
      user.roomDetails.type = req.body.roomDetails.type || '';
      user.roomDetails.bhkType = req.body.roomDetails.bhkType || '';
      user.roomDetails.address = req.body.roomDetails.address || '';
      user.roomDetails.rent = req.body.roomDetails.rent !== undefined ? parseFloat(req.body.roomDetails.rent) : 0;
      user.roomDetails.availableFrom = req.body.roomDetails.availableFrom ? new Date(req.body.roomDetails.availableFrom) : undefined;
      user.roomDetails.amenities = req.body.roomDetails.amenities || [];
      user.roomDetails.photos = req.body.roomDetails.photos || [];
      user.roomDetails.description = req.body.roomDetails.description || '';
    } else if (req.body.userType === 'room_provider' && req.body.onboarded === true) {
      // If room_provider is onboarded but no roomDetails are sent (e.g., skipped), clear roomDetails
      user.roomDetails = {
        type: '',
        bhkType: '',
        address: '',
        rent: 0,
        availableFrom: undefined,
        amenities: [],
        photos: [],
        description: ''
      };
    }

    await user.save();
    console.log('User profile updated successfully:', user.firebaseUid);
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

// Get users who liked the current user
router.get('/liked-by', auth, async (req, res) => {
  try {
    console.log('Fetching users who liked:', req.user.uid);
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!currentUser) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all users who have the current user in their likes array
    const usersWhoLiked = await User.find({
      likes: currentUser._id
    }).select('-password -email');

    console.log('Found users who liked:', usersWhoLiked.length);
    res.json(usersWhoLiked);
  } catch (error) {
    console.error('Error fetching users who liked:', error);
    res.status(500).json({ message: 'Error fetching users who liked', error: error.message });
  }
});

module.exports = router; 