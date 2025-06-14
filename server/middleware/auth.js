const admin = require('firebase-admin');
const User = require('../models/User');

// Make sure to initialize admin in your main server file with your service account

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // For POST requests to /api/profiles, we don't need to check if user exists
    // as this is the endpoint that creates the user profile
    if (req.method === 'POST' && req.path === '/') {
      req.user = {
        uid: decodedToken.uid
      };
      return next();
    }

    // For all other routes, find user in database to get MongoDB _id
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set both uid and _id for compatibility
    req.user = {
      uid: decodedToken.uid,
      _id: user._id
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
}; 