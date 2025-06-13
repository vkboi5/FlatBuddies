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
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.firebaseUid;
    }
  },
  name: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['room_seeker', 'room_provider'],
    required: true
  },
  profile: {
    age: {
      type: Number,
      required: false
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false
    },
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
      },
      city: {
        type: String,
        required: false
      },
      area: {
        type: String,
        required: false
      }
    },
    preferences: {
      budget: {
        min: {
          type: Number,
          required: false
        },
        max: {
          type: Number,
          required: false
        }
      },
      roommates: {
        gender: {
          type: String,
          enum: ['male', 'female', 'any'],
          required: false
        },
        ageRange: {
          min: {
            type: Number,
            required: false
          },
          max: {
            type: Number,
            required: false
          }
        }
      },
      lifestyle: {
        cleanliness: {
          type: Number,
          min: 1,
          max: 10,
          default: 5
        },
        socialLevel: {
          type: Number,
          min: 1,
          max: 10,
          default: 5
        },
        workMode: {
          type: String,
          enum: ['wfh', 'office', 'hybrid'],
          default: 'office'
        },
        smoking: {
          type: String,
          enum: ['yes', 'no'],
          default: 'no'
        },
        pets: {
          type: String,
          enum: ['yes', 'no'],
          default: 'no'
        },
        foodPreference: {
          type: String,
          enum: ['vegetarian', 'non-vegetarian', 'vegan', 'any'],
          default: 'any'
        }
      }
    }
  },
  roomDetails: {
    bhkType: {
      type: String,
      enum: ['1RK', '1BHK', '2BHK', '3BHK', '4BHK+', ''],
      default: ''
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'studio', ''],
      default: ''
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
  }],
  onboarded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ 'profile.location': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 