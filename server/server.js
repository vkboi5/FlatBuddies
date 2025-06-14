const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketService = require('./services/socketService');
const User = require('./models/User');
const admin = require('firebase-admin');
const serviceAccount = require('./flatbuddies-e6e7b-firebase-adminsdk-fbsvc-6041dbb9fe.json');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const messageRoutes = require('./routes/messages');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
socketService.initialize(server);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ 
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ message: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flatmates')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create dummy profiles if none exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const dummyProfiles = [
        {
          firebaseUid: 'dummy-user-1',
          email: 'john@example.com',
          password: 'password123',
          name: 'John Doe',
          userType: 'room_provider',
          profile: {
            age: 28,
            gender: 'male',
            occupation: 'Software Engineer',
            bio: 'I have a spacious 2-bedroom apartment in downtown. Looking for a clean and responsible roommate.',
            interests: ['coding', 'gaming', 'cooking'],
            location: {
              type: 'Point',
              coordinates: [0, 0]
            },
            preferences: {
              budget: {
                min: 800,
                max: 1200
              },
              roommates: {
                gender: 'any',
                ageRange: {
                  min: 25,
                  max: 35
                }
              }
            }
          },
          roomDetails: {
            type: 'apartment',
            address: '123 Main St, Downtown',
            rent: 1000,
            availableFrom: new Date(),
            amenities: ['wifi', 'parking', 'gym'],
            description: 'Modern 2-bedroom apartment with great amenities'
          }
        },
        {
          firebaseUid: 'dummy-user-2',
          email: 'sarah@example.com',
          password: 'password123',
          name: 'Sarah Smith',
          userType: 'room_seeker',
          profile: {
            age: 25,
            gender: 'female',
            occupation: 'Graphic Designer',
            bio: 'Creative professional looking for a quiet and peaceful living space.',
            interests: ['art', 'photography', 'yoga'],
            location: {
              type: 'Point',
              coordinates: [0, 0]
            },
            preferences: {
              budget: {
                min: 600,
                max: 900
              },
              roommates: {
                gender: 'female',
                ageRange: {
                  min: 22,
                  max: 30
                }
              }
            }
          }
        },
        {
          firebaseUid: 'dummy-user-3',
          email: 'mike@example.com',
          password: 'password123',
          name: 'Mike Johnson',
          userType: 'room_provider',
          profile: {
            age: 32,
            gender: 'male',
            occupation: 'Marketing Manager',
            bio: 'I have a beautiful house with a garden. Looking for a long-term roommate.',
            interests: ['gardening', 'cooking', 'reading'],
            location: {
              type: 'Point',
              coordinates: [0, 0]
            },
            preferences: {
              budget: {
                min: 700,
                max: 1000
              },
              roommates: {
                gender: 'any',
                ageRange: {
                  min: 25,
                  max: 40
                }
              }
            }
          },
          roomDetails: {
            type: 'house',
            address: '456 Oak St, Suburbs',
            rent: 900,
            availableFrom: new Date(),
            amenities: ['garden', 'garage', 'fireplace'],
            description: 'Cozy house with a beautiful garden and modern amenities'
          }
        }
      ];

      try {
        const users = await User.create(dummyProfiles);
        console.log('Created dummy profiles:', users.map(user => ({
          id: user._id,
          firebaseUid: user.firebaseUid,
          name: user.name,
          userType: user.userType
        })));
      } catch (error) {
        console.error('Error creating dummy profiles:', error);
      }
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 