const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all matches for the authenticated user
router.get('/', auth, async (req, res) => {
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

// Get match details
router.get('/:matchId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the requested match exists in user's matches
    if (!user.matches.includes(req.params.matchId)) {
      return res.status(403).json({ message: 'Not authorized to view this match' });
    }

    const match = await User.findById(req.params.matchId)
      .select('-password -email');
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching match details', error: error.message });
  }
});

// Remove a match
router.delete('/:matchId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove match from both users
    user.matches = user.matches.filter(match => match.toString() !== req.params.matchId);
    await user.save();

    const otherUser = await User.findById(req.params.matchId);
    if (otherUser) {
      otherUser.matches = otherUser.matches.filter(match => match.toString() !== user._id.toString());
      await otherUser.save();
    }

    res.json({ message: 'Match removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing match', error: error.message });
  }
});

module.exports = router; 