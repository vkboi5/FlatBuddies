const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get potential matches based on user type
router.get('/potential-matches', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find users of opposite type who haven't been liked or disliked
    const query = {
      _id: { $ne: user._id },
      userType: user.userType === 'room_seeker' ? 'room_provider' : 'room_seeker',
      $and: [
        { _id: { $nin: user.likes } },
        { _id: { $nin: user.dislikes } }
      ]
    };

    // Add location-based filtering if coordinates are available
    if (user.profile.location.coordinates[0] !== 0 && user.profile.location.coordinates[1] !== 0) {
      query['profile.location'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.profile.location.coordinates
          },
          $maxDistance: 50000 // 50km radius
        }
      };
    }

    const potentialMatches = await User.find(query)
      .select('-password -email')
      .limit(20);

    res.json(potentialMatches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching potential matches', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key === 'profile' || key === 'roomDetails') {
        user[key] = { ...user[key], ...updates[key] };
      } else {
        user[key] = updates[key];
      }
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Like a user
router.post('/like/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const likedUser = await User.findById(req.params.userId);

    if (!user || !likedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to likes
    user.likes.push(likedUser._id);
    await user.save();

    // Check if it's a match
    if (likedUser.likes.includes(user._id)) {
      user.matches.push(likedUser._id);
      likedUser.matches.push(user._id);
      await likedUser.save();
      await user.save();

      // Emit match event through socket.io
      req.app.get('io').emit('newMatch', {
        users: [user._id, likedUser._id]
      });

      return res.json({ message: 'It\'s a match!', isMatch: true });
    }

    res.json({ message: 'Like recorded', isMatch: false });
  } catch (error) {
    res.status(500).json({ message: 'Error processing like', error: error.message });
  }
});

// Dislike a user
router.post('/dislike/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.dislikes.push(req.params.userId);
    await user.save();

    res.json({ message: 'Dislike recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing dislike', error: error.message });
  }
});

// Get user matches
router.get('/matches', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('matches', '-password -email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
});

module.exports = router; 