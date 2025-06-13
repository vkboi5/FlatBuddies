const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const dummyProfiles = [
  {
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

const createDummyProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flatmates');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    const users = await User.create(dummyProfiles);
    console.log('Created dummy profiles:', users.map(user => ({
      id: user._id,
      name: user.name,
      userType: user.userType
    })));

    process.exit(0);
  } catch (error) {
    console.error('Error creating dummy profiles:', error);
    process.exit(1);
  }
};

createDummyProfiles(); 