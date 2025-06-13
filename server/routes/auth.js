const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      userType,
      profile: {
        age: 25,
        gender: 'male',
        occupation: 'Software Developer',
        bio: 'Looking for a nice place to stay',
        interests: ['coding', 'reading', 'travel'],
        location: {
          type: 'Point',
          coordinates: [0, 0]
        },
        preferences: {
          budget: {
            min: 500,
            max: 1000
          },
          roommates: {
            gender: 'any',
            ageRange: {
              min: 20,
              max: 35
            }
          }
        }
      }
    });

    await user.save();
    console.log('New user registered:', {
      id: user._id,
      email: user.email,
      name: user.name,
      userType: user.userType
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Create or update user from Firebase
router.post('/firebase-user', async (req, res) => {
  try {
    const { uid, email, name } = req.body;

    if (!uid || !email || !name) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: { uid, email, name }
      });
    }

    // Check if user already exists
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // Create new user with basic info
      user = new User({
        firebaseUid: uid,
        email,
        name,
        profile: {
          age: null,
          gender: null,
          occupation: null,
          bio: null,
          interests: [],
          location: {
            type: 'Point',
            coordinates: [0, 0]
          },
          preferences: {
            budget: {
              min: null,
              max: null
            },
            roommates: {
              gender: null,
              ageRange: {
                min: null,
                max: null
              }
            }
          }
        }
      });

      await user.save();
      console.log('New user created from Firebase:', {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name
      });
    }

    res.json({
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        userType: user.userType,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Firebase user creation error:', error);
    res.status(500).json({ 
      message: 'Error creating/updating user', 
      error: error.message,
      details: error.errors
    });
  }
});

module.exports = router; 