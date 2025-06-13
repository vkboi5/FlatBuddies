const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  userType: {
    type: String,
    enum: ['room_seeker', 'room_provider'],
    required: false
  },
  profile: {
    age: Number,
    gender: String,
    occupation: String,
    bio: String,
    interests: [String],
    photos: [String],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    preferences: {
      budget: {
        min: Number,
        max: Number
      },
      roommates: {
        gender: String,
        ageRange: {
          min: Number,
          max: Number
        }
      },
      foodPreference: {
        type: String,
        enum: ['vegetarian', 'non-vegetarian', 'vegan', 'any'],
        default: 'any'
      },
      cleanlinessPreference: {
        type: String,
        enum: ['very clean', 'average', 'flexible', 'any'],
        default: 'any'
      },
      petFriendly: {
        type: Boolean,
        default: false
      },
      smokingFriendly: {
        type: Boolean,
        default: false
      }
    }
  },
  roomDetails: {
    type: {
      type: String,
      enum: ['apartment', 'house', 'studio'],
    },
    address: String,
    rent: Number,
    availableFrom: Date,
    amenities: [String],
    photos: [String],
    description: String
  },
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});


// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for geospatial queries
userSchema.index({ 'profile.location': '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = User; 