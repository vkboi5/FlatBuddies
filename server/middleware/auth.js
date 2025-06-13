const admin = require('firebase-admin');

// Make sure to initialize admin in your main server file with your service account

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    // Set both uid and userId for compatibility
    req.user = {
      uid: decodedToken.uid,
      userId: decodedToken.uid
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
}; 