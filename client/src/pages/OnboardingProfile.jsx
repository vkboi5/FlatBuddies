import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Input,
  Stack,
  Slider,
  OutlinedInput,
  Chip,
  Avatar,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import {
  FaUser, FaHome, FaHeart, FaSmoking, FaPaw, FaUtensils, FaBroom, FaUsers, FaLaptop, FaBuilding,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import UserTypeModal from '../components/UserTypeModal';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { useUserType } from '../contexts/UserTypeContext';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { createFilterOptions } from '@mui/material/Autocomplete';
import LocationMapModal from '../components/LocationMapModal';
import CloseIcon from '@mui/icons-material/Close';

const firebaseConfig = {
  apiKey: "AIzaSyAP3ruMIUK4A8AHo-I1AaRG6BFXv8gwXxQ",
  authDomain: "flatbuddies-e6e7b.firebaseapp.com",
  projectId: "flatbuddies-e6e7b",
  storageBucket: "flatbuddies-e6e7b.appspot.com",
  messagingSenderId: "643218990933",
  appId: "1:643218990933:web:5195d4928a69cd834231dc"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const interestsOptions = [
  'Reading', 'Writing', 'Music', 'Movies', 'Gaming', 'Sports', 'Fitness', 'Hiking', 'Camping',
  'Cooking', 'Baking', 'Gardening', 'Photography', 'Painting', 'Drawing', 'Crafts', 'Fashion',
  'Travel', 'Languages', 'Volunteering', 'Technology', 'Science', 'History', 'Politics',
  'Animals', 'Cars', 'Motorcycles', 'Dancing', 'Yoga', 'Meditation', 'Cycling', 'Swimming',
  'Running', 'Fishing', 'Hunting', 'Collecting', 'Board Games', 'Puzzles'
];

const sampleLocations = [
  "New Delhi, Connaught Place", "New Delhi, Dwarka", "New Delhi, Karol Bagh",
  "Mumbai, Bandra", "Mumbai, Andheri", "Mumbai, Powai",
  "Bengaluru, Koramangala", "Bengaluru, HSR Layout", "Bengaluru, Indiranagar",
  "Chennai, Adyar", "Chennai, T. Nagar", "Chennai, Velachery",
  "Kolkata, Salt Lake", "Kolkata, New Town", "Kolkata, Ballygunge",
  "Hyderabad, Gachibowli", "Hyderabad, Hitech City", "Hyderabad, Banjara Hills",
  "Pune, Koregaon Park", "Pune, Baner", "Pune, Hadapsar",
  "Ahmedabad, Satellite", "Ahmedabad, SG Highway", "Ahmedabad, Thaltej",
  "Jaipur, Malviya Nagar", "Jaipur, C Scheme", "Jaipur, Vaishali Nagar",
  "Lucknow, Hazratganj", "Lucknow, Gomti Nagar", "Lucknow, Aliganj"
];

const filterOptions = createFilterOptions();

const gradientBackground = 'linear-gradient(120deg, #f6f9fc 0%, #eef2f7 100%)';
const cardGradient = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))';
const primaryGradient = 'linear-gradient(90deg, #2B32B2 0%, #1488CC 100%)';

const OnboardingProfile = () => {
  const navigate = useNavigate();
  const { updateProfile, currentUser, userProfile, loading } = useAuth();
  const { userType, setUserType } = useUserType();
  const [step, setStep] = useState(1);
  const [showUserTypeModal, setShowUserTypeModal] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    gender: '',
    occupation: '',
    bio: '',
    photos: [],
    interests: [],
    location: {
      type: 'Point',
      coordinates: [0, 0],
      city: '',
      area: '',
    },
    preferences: {
      budget: {
        min: 0,
        max: 0
      },
      roommates: {
        gender: '',
        ageRange: {
          min: 0,
          max: 0
        }
      },
      lifestyle: {
        cleanliness: 5,
        socialLevel: 5,
        workMode: 'office',
        smoking: 'no',
        pets: 'no',
        foodPreference: 'any'
      },
      desiredRentMin: 0,
      desiredRentMax: 0,
      desiredPropertyType: '',
      desiredBhkType: '',
      desiredMoveInDate: '',
      desiredFurnishingStatus: '',
      desiredAmenities: [],
      lookingFor: {
        roomType: '',
        sharingPreference: '',
        moveInDate: '',
        stayDuration: '',
        budgetRange: {
          min: 0,
          max: 0
        },
        desiredLocation: {
          city: '',
          area: '',
          coordinates: [0, 0]
        },
        desiredBhkType: '',
      }
    },
    property: {
      hasProperty: false,
      rent: '',
      propertyType: '',
      bhkType: '',
      availableFrom: '',
      furnishingStatus: '',
      amenities: [],
      description: '',
      images: [],
    }
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!loading && currentUser && userProfile) {
      if (userProfile.onboarded) {
        navigate('/explore');
      } else {
        setFormData(prev => ({
          ...prev,
          name: userProfile.name || '',
          userType: userProfile.userType || '',
          age: userProfile.profile?.age || 0,
          gender: userProfile.profile?.gender || '',
          occupation: userProfile.profile?.occupation || '',
          bio: userProfile.profile?.bio || '',
          photos: userProfile.profile?.photos || [],
          interests: userProfile.profile?.interests || [],
          location: {
            city: userProfile.profile?.location?.city || '',
            area: userProfile.profile?.location?.area || '',
            coordinates: userProfile.profile?.location?.coordinates || [0, 0]
          },
          preferences: {
            budget: {
              min: userProfile.profile?.preferences?.budget?.min || 0,
              max: userProfile.profile?.preferences?.budget?.max || 0
            },
            roommates: {
              gender: userProfile.profile?.preferences?.roommates?.gender || '',
              ageRange: {
                min: userProfile.profile?.preferences?.roommates?.ageRange?.min || 0,
                max: userProfile.profile?.preferences?.roommates?.ageRange?.max || 0
              }
            },
            lifestyle: {
              cleanliness: userProfile.profile?.preferences?.lifestyle?.cleanliness || 5,
              socialLevel: userProfile.profile?.preferences?.lifestyle?.socialLevel || 5,
              workMode: userProfile.profile?.preferences?.lifestyle?.workMode || 'office',
              smoking: userProfile.profile?.preferences?.lifestyle?.smoking || 'no',
              pets: userProfile.profile?.preferences?.lifestyle?.pets || 'no',
              foodPreference: userProfile.profile?.preferences?.lifestyle?.foodPreference || 'any'
            },
            desiredRentMin: userProfile.profile?.preferences?.desiredRentMin || 0,
            desiredRentMax: userProfile.profile?.preferences?.desiredRentMax || 0,
            desiredPropertyType: userProfile.profile?.preferences?.desiredPropertyType || '',
            desiredBhkType: userProfile.profile?.preferences?.desiredBhkType || '',
            desiredMoveInDate: userProfile.profile?.preferences?.desiredMoveInDate || '',
            desiredFurnishingStatus: userProfile.profile?.preferences?.desiredFurnishingStatus || '',
            desiredAmenities: userProfile.profile?.preferences?.desiredAmenities || [],
            lookingFor: {
              roomType: userProfile.profile?.preferences?.lookingFor?.roomType || '',
              sharingPreference: userProfile.profile?.preferences?.lookingFor?.sharingPreference || '',
              moveInDate: userProfile.profile?.preferences?.lookingFor?.moveInDate || '',
              stayDuration: userProfile.profile?.preferences?.lookingFor?.stayDuration || '',
              budgetRange: {
                min: userProfile.profile?.preferences?.lookingFor?.budgetRange?.min || 0,
                max: userProfile.profile?.preferences?.lookingFor?.budgetRange?.max || 0
              },
              desiredLocation: {
                city: userProfile.profile?.preferences?.lookingFor?.desiredLocation?.city || '',
                area: userProfile.profile?.preferences?.lookingFor?.desiredLocation?.area || '',
                coordinates: userProfile.profile?.preferences?.lookingFor?.desiredLocation?.coordinates || [0, 0]
              },
              desiredBhkType: userProfile.profile?.preferences?.lookingFor?.desiredBhkType || '',
            }
          }
        }));
        setUserType(userProfile.userType || null);
        if (userProfile.profile?.photos && userProfile.profile.photos.length > 0) {
          setPhotoPreview(userProfile.profile.photos[0]);
        }
      }
    }
  }, [loading, currentUser, userProfile, navigate, setUserType]);

  const handleUserTypeSelect = (type) => {
    // If type is room_seeker and hasProperty is true, set as room_provider
    // Otherwise, use the type directly from the modal
    const finalType = type === 'room_seeker' && formData.property.hasProperty ? 'room_provider' : type;
    setUserType(finalType);
    setShowUserTypeModal(false);
    setFormData(prev => ({
      ...prev,
      userType: finalType,
      property: {
        ...prev.property,
        hasProperty: type === 'room_provider' // Set hasProperty based on the initial selection
      }
    }));
  };

  const getSteps = () => {
    if (userType === 'room_seeker') {
      return [
        'Basic Information',
        'Location & Budget',
        'Lifestyle Preferences',
        'Roommate Preferences'
      ];
    } else {
      return [
        'Basic Information',
        'Location & Property Details',
        'Lifestyle Preferences',
        'Roommate Preferences'
      ];
    }
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender && formData.location.city;
      case 2:
        if (userType === 'room_seeker') {
          if (formData.property.hasProperty) {
            return formData.property.location?.city &&
                   formData.property.rent > 0 &&
                   formData.property.propertyType &&
                   formData.property.bhkType &&
                   formData.property.availableFrom &&
                   formData.property.furnishingStatus &&
                   formData.property.description;
          } else {
            return formData.preferences.lookingFor.roomType &&
                   formData.preferences.lookingFor.sharingPreference &&
                   formData.preferences.lookingFor.moveInDate &&
                   formData.preferences.lookingFor.stayDuration &&
                   formData.preferences.lookingFor.budgetRange.min > 0 &&
                   formData.preferences.lookingFor.budgetRange.max > 0 &&
                   formData.preferences.lookingFor.desiredLocation.city &&
                   formData.preferences.lookingFor.desiredBhkType;
          }
        } else {
          if (formData.property.hasProperty) {
            return formData.property.rent > 0 &&
                   formData.property.propertyType &&
                   formData.property.bhkType &&
                   formData.property.availableFrom &&
                   formData.property.furnishingStatus &&
                   formData.property.description;
          } else {
            return formData.preferences.budget.min > 0 && formData.preferences.budget.max > 0;
          }
        }
      case 3:
        return true; // Always return true for step 3 as we set default values
      case 4:
        return formData.preferences.roommates.gender && 
               formData.preferences.roommates.ageRange.min && 
               formData.preferences.roommates.ageRange.max;
      default:
        return false;
    }
  };

  const handleNext = (actionType) => {
    console.log('handleNext called with actionType:', actionType);
    // Set default values for lifestyle preferences if not set
    if (step === 2) {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          lifestyle: {
            cleanliness: prev.preferences.lifestyle.cleanliness || 5,
            socialLevel: prev.preferences.lifestyle.socialLevel || 5,
            workMode: prev.preferences.lifestyle.workMode || 'office',
            smoking: prev.preferences.lifestyle.smoking || 'no',
            pets: prev.preferences.lifestyle.pets || 'no',
            foodPreference: prev.preferences.lifestyle.foodPreference || 'any'
          }
        }
      }));
    }

    let isValid = true;

    if (actionType === 'skip' || actionType === 'listRoomLater') {
      isValid = true; // Bypass validation for skip/list room later
      console.log('Bypassing validation for skip/listRoomLater. isValid:', isValid);
    } else {
      // For 'next' action or other steps, use the comprehensive validateStep
      isValid = validateStep(step);
      console.log('Performing validation. isValid:', isValid);
    }

    if (isValid) {
      console.log('Moving from step', step, 'to step', step + 1);
      setTimeout(() => {
        setStep(prevStep => {
          console.log('Setting step to:', prevStep + 1);
          return prevStep + 1;
        });
      }, 0);
    } else {
      console.log('Step', step, 'validation failed');
      toast.error('Please fill in all required fields before proceeding.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert empty string to 0 for number inputs, otherwise keep value as is
    const processedValue = e.target.type === 'number' && value === '' ? 0 : value;

    if (name.includes('.')) {
      const [parent, child, grandChild] = name.split('.');
      if (parent === 'location' && (child === 'city' || child === 'area')) {
        return;
      }
      if (grandChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandChild]: processedValue
            }
          }
        }));
      } else {
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: processedValue
        }
      }));
      }
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    if (step === 2 && userType === 'room_seeker' && formData.property.hasProperty) {
      // Update property location
      setFormData(prev => ({
        ...prev,
        property: {
          ...prev.property,
          location: {
            city: selectedLocation.city,
            area: selectedLocation.area,
            coordinates: selectedLocation.coordinates,
          }
        }
      }));
    } else if (step === 2 && userType === 'room_seeker') {
      // Update desired location in preferences
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          lookingFor: {
            ...prev.preferences.lookingFor,
            desiredLocation: {
              city: selectedLocation.city,
              area: selectedLocation.area,
              coordinates: selectedLocation.coordinates,
            }
          }
        }
      }));
    } else {
      // Update main location
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          city: selectedLocation.city,
          area: selectedLocation.area,
          coordinates: selectedLocation.coordinates,
        }
      }));
    }
    setShowMapModal(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoUrl = '';
      if (photoFile) {
        const storageRef = ref(storage, `profile_photos/${currentUser.uid}/${photoFile.name}`);
        const snapshot = await uploadBytes(storageRef, photoFile);
        photoUrl = await getDownloadURL(snapshot.ref);
        toast.success('Personal photo uploaded!');
      } else if (photoPreview) {
        photoUrl = formData.photos[0] || '';
      }

      const profileData = {
        name: formData.name,
        userType: userType,
        onboarded: true,
        profile: {
          age: parseInt(formData.age),
          gender: formData.gender,
          occupation: formData.occupation,
          bio: formData.bio,
          photos: photoUrl ? [photoUrl] : [],
          interests: formData.interests,
          location: {
            type: 'Point',
            coordinates: formData.location.coordinates,
            city: formData.location.city,
            area: formData.location.area
          },
          preferences: {
            budget: {
              min: parseInt(formData.preferences.budget.min),
              max: parseInt(formData.preferences.budget.max)
            },
            roommates: {
              gender: formData.preferences.roommates.gender,
              ageRange: {
                min: parseInt(formData.preferences.roommates.ageRange.min),
                max: parseInt(formData.preferences.roommates.ageRange.max)
              }
            },
            lifestyle: {
              cleanliness: formData.preferences.lifestyle.cleanliness || 5,
              socialLevel: formData.preferences.lifestyle.socialLevel || 5,
              workMode: formData.preferences.lifestyle.workMode || 'office',
              smoking: formData.preferences.lifestyle.smoking || 'no',
              pets: formData.preferences.lifestyle.pets || 'no',
              foodPreference: formData.preferences.lifestyle.foodPreference || 'any'
            },
            desiredRentMin: parseInt(formData.preferences.desiredRentMin),
            desiredRentMax: parseInt(formData.preferences.desiredRentMax),
            desiredPropertyType: formData.preferences.desiredPropertyType,
            desiredBhkType: formData.preferences.desiredBhkType,
            desiredMoveInDate: formData.preferences.desiredMoveInDate,
            desiredFurnishingStatus: formData.preferences.desiredFurnishingStatus,
            desiredAmenities: formData.preferences.desiredAmenities,
            lookingFor: {
              roomType: formData.preferences.lookingFor.roomType,
              sharingPreference: formData.preferences.lookingFor.sharingPreference,
              moveInDate: formData.preferences.lookingFor.moveInDate,
              stayDuration: formData.preferences.lookingFor.stayDuration,
              budgetRange: {
                min: parseInt(formData.preferences.lookingFor.budgetRange.min),
                max: parseInt(formData.preferences.lookingFor.budgetRange.max)
              },
              desiredLocation: {
                city: formData.preferences.lookingFor.desiredLocation.city,
                area: formData.preferences.lookingFor.desiredLocation.area,
                coordinates: formData.preferences.lookingFor.desiredLocation.coordinates
              },
              desiredBhkType: formData.preferences.lookingFor.desiredBhkType,
            }
          }
        }
      };

      console.log('Submitting profile data:', profileData);
      await updateProfile(profileData);
      toast.success('Profile created successfully!');
      navigate('/explore');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        lifestyle: {
          ...prev.preferences.lifestyle,
          [name]: newValue
        }
      }
    }));
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  const renderStep = () => {
    if (!userType) return null;

    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                  placeholder="Enter your name"
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  required
                  InputLabelProps={{ shrink: true }}
                  placeholder="Enter your age"
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    label="Gender"
                  >
                    <MenuItem value="">Select gender</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Your occupation"
                />
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Tell us about yourself"
                />
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location.city ? `${formData.location.city}${formData.location.area ? ', ' + formData.location.area : ''}` : ''}
                  onClick={() => setShowMapModal(true)}
                  onFocus={(e) => e.target.blur()}
                  readOnly
                  variant="outlined"
                  required
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Select your location"
                />
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="interests-label" shrink>Interests</InputLabel>
                  <Select
                    labelId="interests-label"
                    multiple
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Interests" InputLabelProps={{ shrink: true }} placeholder="Select your interests" />}
                    renderValue={(selected) =>
                      selected.length === 0 ? (
                        <span style={{ color: '#aaa' }}>Select your interests</span>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )
                    }
                    displayEmpty
                    label="Interests"
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem disabled value="">
                      <span style={{ color: '#aaa' }}>Select your interests</span>
                    </MenuItem>
                    {interestsOptions.map((interest) => (
                      <MenuItem
                        key={interest}
                        value={interest}
                        style={{
                          fontWeight: formData.interests.indexOf(interest) === -1
                            ? 'normal'
                            : 'bold',
                        }}
                      >
                        {interest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Personal Photo
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  id="personal-photo-upload"
                />
                <label htmlFor="personal-photo-upload">
                  <Button variant="outlined" component="span" startIcon={<AddAPhotoIcon />}>
                    Upload Photo
                  </Button>
                </label>
                {photoPreview && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar src={photoPreview} sx={{ width: 80, height: 80, mr: 2 }} />
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        setFormData(prev => ({ ...prev, photos: [] }));
                      }}
                    >
                      Remove Photo
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              Location & Property Details
            </Typography>
            <Grid container spacing={3}>
              {userType === 'room_seeker' ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                      Do you have a room to share?
                    </Typography>
                    <FormControl fullWidth required>
                      <Select
                        value={formData.property.hasProperty ? 'yes' : 'no'}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          property: {
                            ...prev.property,
                            hasProperty: e.target.value === 'yes'
                          }
                        }))}
                      >
                        <MenuItem value="yes">Yes, I have a room</MenuItem>
                        <MenuItem value="no">No, I'm looking for a room</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData.property.hasProperty ? (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          Property Details
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          label="Location"
                          value={formData.property.location?.city ? `${formData.property.location.city}${formData.property.location.area ? ', ' + formData.property.location.area : ''}` : ''}
                          onClick={() => setShowMapModal(true)}
                          onFocus={(e) => e.target.blur()}
                          readOnly
                          variant="outlined"
                          required
                          InputProps={{ readOnly: true }}
                          InputLabelProps={{ shrink: true }}
                          placeholder="Select property location"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Rent per month"
                          value={formData.property.rent}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            property: {
                              ...prev.property,
                              rent: e.target.value
                            }
                          }))}
                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                          required
                          InputLabelProps={{ shrink: true }}
                          placeholder="Monthly rent"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Property Type</InputLabel>
                          <Select
                            value={formData.property.propertyType}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              property: {
                                ...prev.property,
                                propertyType: e.target.value
                              }
                            }))}
                            label="Property Type"
                          >
                            <MenuItem value="apartment">Apartment</MenuItem>
                            <MenuItem value="house">House</MenuItem>
                            <MenuItem value="villa">Villa</MenuItem>
                            <MenuItem value="pg">PG</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>BHK Type</InputLabel>
                          <Select
                            value={formData.property.bhkType}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              property: {
                                ...prev.property,
                                bhkType: e.target.value
                              }
                            }))}
                            label="BHK Type"
                          >
                            <MenuItem value="1RK">1 RK</MenuItem>
                            <MenuItem value="1BHK">1 BHK</MenuItem>
                            <MenuItem value="2BHK">2 BHK</MenuItem>
                            <MenuItem value="3BHK">3 BHK</MenuItem>
                            <MenuItem value="4BHK">4 BHK</MenuItem>
                            <MenuItem value="4+BHK">4+ BHK</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Furnishing Status</InputLabel>
                          <Select
                            value={formData.property.furnishingStatus}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              property: {
                                ...prev.property,
                                furnishingStatus: e.target.value
                              }
                            }))}
                            label="Furnishing Status"
                          >
                            <MenuItem value="furnished">Furnished</MenuItem>
                            <MenuItem value="semi-furnished">Semi-Furnished</MenuItem>
                            <MenuItem value="unfurnished">Unfurnished</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Available From"
                          value={formData.property.availableFrom}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            property: {
                              ...prev.property,
                              availableFrom: e.target.value
                            }
                          }))}
                          InputLabelProps={{ shrink: true }}
                          required
                          placeholder="Select date"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Amenities
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {[
                            'WiFi', 'Parking', 'Power Backup', 'Lift', 'Security',
                            'Gym', 'Swimming Pool', 'Garden', 'Balcony', 'AC',
                            'TV', 'Washing Machine', 'Refrigerator', 'Geyser',
                            'Gas Connection', 'Housekeeping'
                          ].map((amenity) => (
                            <Chip
                              key={amenity}
                              label={amenity}
                              onClick={() => {
                                const currentAmenities = formData.property.amenities || [];
                                const newAmenities = currentAmenities.includes(amenity)
                                  ? currentAmenities.filter(a => a !== amenity)
                                  : [...currentAmenities, amenity];
                                setFormData(prev => ({
                                  ...prev,
                                  property: {
                                    ...prev.property,
                                    amenities: newAmenities
                                  }
                                }));
                              }}
                              color={formData.property.amenities?.includes(amenity) ? "primary" : "default"}
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Property Description"
                          multiline
                          rows={4}
                          value={formData.property.description}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            property: {
                              ...prev.property,
                              description: e.target.value
                            }
                          }))}
                          placeholder="Describe your property, nearby landmarks, and any other important details..."
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                          Looking For
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          label="Desired Location"
                          value={formData.preferences.lookingFor.desiredLocation.city ? `${formData.preferences.lookingFor.desiredLocation.city}${formData.preferences.lookingFor.desiredLocation.area ? ', ' + formData.preferences.lookingFor.desiredLocation.area : ''}` : ''}
                          onClick={() => setShowMapModal(true)}
                          onFocus={(e) => e.target.blur()}
                          readOnly
                          variant="outlined"
                          required
                          InputProps={{ readOnly: true }}
                          InputLabelProps={{ shrink: true }}
                          placeholder="Select desired location"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Room Type</InputLabel>
                          <Select
                            value={formData.preferences.lookingFor.roomType}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                lookingFor: {
                                  ...prev.preferences.lookingFor,
                                  roomType: e.target.value
                                }
                              }
                            }))}
                            label="Room Type"
                          >
                            <MenuItem value="">Select Room Type</MenuItem>
                            <MenuItem value="single">Single Room</MenuItem>
                            <MenuItem value="double">Double Sharing</MenuItem>
                            <MenuItem value="triple">Triple Sharing</MenuItem>
                            <MenuItem value="any">Any</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>BHK Type</InputLabel>
                          <Select
                            value={formData.preferences.lookingFor.desiredBhkType}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                lookingFor: {
                                  ...prev.preferences.lookingFor,
                                  desiredBhkType: e.target.value
                                }
                              }
                            }))}
                            label="BHK Type"
                          >
                            <MenuItem value="">Select BHK Type</MenuItem>
                            <MenuItem value="1RK">1 RK</MenuItem>
                            <MenuItem value="1BHK">1 BHK</MenuItem>
                            <MenuItem value="2BHK">2 BHK</MenuItem>
                            <MenuItem value="3BHK">3 BHK</MenuItem>
                            <MenuItem value="4BHK">4 BHK</MenuItem>
                            <MenuItem value="4+BHK">4+ BHK</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Sharing Preference</InputLabel>
                          <Select
                            value={formData.preferences.lookingFor.sharingPreference}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                lookingFor: {
                                  ...prev.preferences.lookingFor,
                                  sharingPreference: e.target.value
                                }
                              }
                            }))}
                            label="Sharing Preference"
                          >
                            <MenuItem value="">Select Sharing Preference</MenuItem>
                            <MenuItem value="male">Male Only</MenuItem>
                            <MenuItem value="female">Female Only</MenuItem>
                            <MenuItem value="any">Any</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Desired Move-in Date"
                          value={formData.preferences.lookingFor.moveInDate}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              lookingFor: {
                                ...prev.preferences.lookingFor,
                                moveInDate: e.target.value
                              }
                            }
                          }))}
                          InputLabelProps={{ shrink: true }}
                          required
                          placeholder="Select date"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Stay Duration</InputLabel>
                          <Select
                            value={formData.preferences.lookingFor.stayDuration}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                lookingFor: {
                                  ...prev.preferences.lookingFor,
                                  stayDuration: e.target.value
                                }
                              }
                            }))}
                            label="Stay Duration"
                          >
                            <MenuItem value="">Select Stay Duration</MenuItem>
                            <MenuItem value="1-3">1-3 months</MenuItem>
                            <MenuItem value="3-6">3-6 months</MenuItem>
                            <MenuItem value="6-12">6-12 months</MenuItem>
                            <MenuItem value="12+">12+ months</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>Desired Property Budget Range (per month)</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Minimum"
                              value={formData.preferences.lookingFor.budgetRange.min}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  lookingFor: {
                                    ...prev.preferences.lookingFor,
                                    budgetRange: {
                                      ...prev.preferences.lookingFor.budgetRange,
                                      min: e.target.value
                                    }
                                  }
                                }
                              }))}
                              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              required
                              InputLabelProps={{ shrink: true }}
                              placeholder="Minimum budget"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Maximum"
                              value={formData.preferences.lookingFor.budgetRange.max}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  lookingFor: {
                                    ...prev.preferences.lookingFor,
                                    budgetRange: {
                                      ...prev.preferences.lookingFor.budgetRange,
                                      max: e.target.value
                                    }
                                  }
                                }
                              }))}
                              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              required
                              InputLabelProps={{ shrink: true }}
                              placeholder="Maximum budget"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Grid item xs={12} sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Do you have a room/flat?</InputLabel>
                      <Select
                        value={formData.property.hasProperty}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          property: {
                            ...prev.property,
                            hasProperty: e.target.value
                          }
                        }))}
                        label="Do you have a room/flat?"
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {formData.property.hasProperty && (
                    <>
                      <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          label="Rent Amount (₹)"
                          type="number"
                          value={formData.property.rent}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            property: {
                              ...prev.property,
                              rent: e.target.value
                            }
                          }))}
                          required
                          InputLabelProps={{ shrink: true }}
                          placeholder="Monthly rent"
                        />
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Property Type</InputLabel>
                          <Select
                            value={formData.property.propertyType}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              property: {
                                ...prev.property,
                                propertyType: e.target.value
                              }
                            }))}
                            label="Property Type"
                            required
                          >
                            <MenuItem value="apartment">Apartment</MenuItem>
                            <MenuItem value="house">House</MenuItem>
                            <MenuItem value="villa">Villa</MenuItem>
                            <MenuItem value="pg">PG</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>BHK Type</InputLabel>
                          <Select
                            value={formData.property.bhkType}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              property: {
                                ...prev.property,
                                bhkType: e.target.value
                              }
                            }))}
                            label="BHK Type"
                            required
                          >
                            <MenuItem value="1RK">1 RK</MenuItem>
                            <MenuItem value="1BHK">1 BHK</MenuItem>
                            <MenuItem value="2BHK">2 BHK</MenuItem>
                            <MenuItem value="3BHK">3 BHK</MenuItem>
                            <MenuItem value="4BHK">4 BHK</MenuItem>
                            <MenuItem value="4+BHK">4+ BHK</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          label="Available From"
                          type="date"
                          value={formData.property.availableFrom}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            property: {
                              ...prev.property,
                              availableFrom: e.target.value
                            }
                          }))}
                          InputLabelProps={{ shrink: true }}
                          required
                          placeholder="Select date"
                        />
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Furnishing Status</InputLabel>
                          <Select
                            value={formData.property.furnishingStatus}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              property: {
                                ...prev.property,
                                furnishingStatus: e.target.value
                              }
                            }))}
                            label="Furnishing Status"
                            required
                          >
                            <MenuItem value="furnished">Furnished</MenuItem>
                            <MenuItem value="semi-furnished">Semi-Furnished</MenuItem>
                            <MenuItem value="unfurnished">Unfurnished</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Amenities</InputLabel>
                          <Select
                            multiple
                            value={formData.property.amenities}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              property: {
                                ...prev.property,
                                amenities: e.target.value
                              }
                            }))}
                            label="Amenities"
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                          >
                            <MenuItem value="parking">Parking</MenuItem>
                            <MenuItem value="lift">Lift</MenuItem>
                            <MenuItem value="power_backup">Power Backup</MenuItem>
                            <MenuItem value="security">Security</MenuItem>
                            <MenuItem value="gym">Gym</MenuItem>
                            <MenuItem value="swimming_pool">Swimming Pool</MenuItem>
                            <MenuItem value="garden">Garden</MenuItem>
                            <MenuItem value="wifi">WiFi</MenuItem>
                            <MenuItem value="ac">AC</MenuItem>
                            <MenuItem value="tv">TV</MenuItem>
                            <MenuItem value="washing_machine">Washing Machine</MenuItem>
                            <MenuItem value="refrigerator">Refrigerator</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          label="Property Description"
                          multiline
                          rows={4}
                          value={formData.property.description}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            property: {
                              ...prev.property,
                              description: e.target.value
                            }
                          }))}
                          required
                          InputLabelProps={{ shrink: true }}
                          placeholder="Describe your property, nearby landmarks, and any other important details..."
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                          Room Images
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setFormData(prev => ({
                              ...prev,
                              property: {
                                ...prev.property,
                                images: [...prev.property.images, ...files]
                              }
                            }));
                          }}
                          style={{ display: 'none' }}
                          id="room-images-upload"
                        />
                        <label htmlFor="room-images-upload">
                          <Button variant="outlined" component="span" startIcon={<AddAPhotoIcon />}>
                            Upload Room Images
                          </Button>
                        </label>
                        {formData.property.images.length > 0 && (
                          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {formData.property.images.map((image, index) => (
                              <Box key={index} sx={{ position: 'relative' }}>
                                <Avatar
                                  src={URL.createObjectURL(image)}
                                  sx={{ width: 100, height: 100 }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    bgcolor: 'background.paper',
                                    '&:hover': { bgcolor: 'background.paper' }
                                  }}
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      property: {
                                        ...prev.property,
                                        images: prev.property.images.filter((_, i) => i !== index)
                                      }
                                    }));
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              Lifestyle Preferences
            </Typography>
            <Grid container spacing={3}>
              {/* Cleanliness Level */}
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <FaBroom size={20} color="#666" />
                    <Typography variant="subtitle1">Cleanliness Level</Typography>
                  </Stack>
                  <Slider
                    value={formData.preferences.lifestyle.cleanliness}
                    onChange={handleSliderChange('cleanliness')}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    sx={{
                      '& .MuiSlider-thumb': {
                        width: 24,
                        height: 24,
                      },
                      '& .MuiSlider-track': {
                        height: 8,
                      },
                      '& .MuiSlider-rail': {
                        height: 8,
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" align="center">
                    {formData.preferences.lifestyle.cleanliness === 1 ? 'Very Relaxed' :
                     formData.preferences.lifestyle.cleanliness === 10 ? 'Very Clean' :
                     'Moderate'}
                  </Typography>
                </Box>
              </Grid>

              {/* Social Level */}
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <FaUsers size={20} color="#666" />
                    <Typography variant="subtitle1">Social Level</Typography>
                  </Stack>
                  <Slider
                    value={formData.preferences.lifestyle.socialLevel}
                    onChange={handleSliderChange('socialLevel')}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    sx={{
                      '& .MuiSlider-thumb': {
                        width: 24,
                        height: 24,
                      },
                      '& .MuiSlider-track': {
                        height: 8,
                      },
                      '& .MuiSlider-rail': {
                        height: 8,
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" align="center">
                    {formData.preferences.lifestyle.socialLevel === 1 ? 'Very Private' :
                     formData.preferences.lifestyle.socialLevel === 10 ? 'Very Social' :
                     'Moderate'}
                  </Typography>
                </Box>
              </Grid>

              {/* Work Mode */}
              <Grid item xs={12} sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    {formData.preferences.lifestyle.workMode === 'wfh' ? (
                      <FaLaptop size={20} color="#666" />
                    ) : formData.preferences.lifestyle.workMode === 'office' ? (
                      <FaBuilding size={20} color="#666" />
                    ) : (
                      <FaUsers size={20} color="#666" />
                    )}
                    <Typography variant="subtitle1">Work Mode</Typography>
                  </Stack>
                  <Select
                    name="preferences.lifestyle.workMode"
                    value={formData.preferences.lifestyle.workMode}
                    onChange={handleInputChange}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="wfh">Work from Home</MenuItem>
                    <MenuItem value="office">Office Work</MenuItem>
                    <MenuItem value="hybrid">Hybrid Work</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Other Preferences */}
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Smoking</InputLabel>
                  <Select
                    name="preferences.lifestyle.smoking"
                    value={formData.preferences.lifestyle.smoking}
                    onChange={handleInputChange}
                    label="Smoking"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Pets</InputLabel>
                  <Select
                    name="preferences.lifestyle.pets"
                    value={formData.preferences.lifestyle.pets}
                    onChange={handleInputChange}
                    label="Pets"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Food Preference</InputLabel>
                  <Select
                    name="preferences.lifestyle.foodPreference"
                    value={formData.preferences.lifestyle.foodPreference}
                    onChange={handleInputChange}
                    label="Food Preference"
                  >
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                    <MenuItem value="any">Any</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              Roommate Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Preferred Gender</InputLabel>
                  <Select
                    name="preferences.roommates.gender"
                    value={formData.preferences.roommates.gender}
                    onChange={handleInputChange}
                    label="Preferred Gender"
                  >
                    <MenuItem value="">Select preference</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="any">Any</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Min Age"
                    type="number"
                    name="preferences.roommates.ageRange.min"
                    value={formData.preferences.roommates.ageRange.min}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    InputLabelProps={{ shrink: true }}
                    placeholder="18"
                  />
                  <TextField
                    fullWidth
                    label="Max Age"
                    type="number"
                    name="preferences.roommates.ageRange.max"
                    value={formData.preferences.roommates.ageRange.max}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    InputLabelProps={{ shrink: true }}
                    placeholder="99"
                  />
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <UserTypeModal 
        open={showUserTypeModal} 
        onSelect={handleUserTypeSelect} 
      />
      <LocationMapModal
        open={showMapModal}
        onSelectLocation={handleLocationSelect}
        onClose={handleCloseMapModal}
      />
      
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #e3f2fd 0%, #e8eaf6 100%)',
          py: { xs: 3, sm: 6 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 4 }, 
              borderRadius: 6,
              background: '#fff',
              boxShadow: '0 8px 32px 0 rgba(36,81,166,0.10)',
            }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h4" 
                align="center" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  color: '#2451a6',
                  mb: 3,
                  letterSpacing: 1,
                }}
              >
                Complete Your Profile
              </Typography>
              <Stepper 
                activeStep={step - 1} 
                alternativeLabel
                sx={{
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#2451a6',
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: '#2451a6',
                    fontWeight: 700,
                  },
                  '& .MuiStepLabel-label': {
                    fontWeight: 600,
                    fontSize: '1rem',
                  },
                  '& .MuiStepConnector-line': {
                    borderColor: '#b3c7f7',
                  },
                }}
              >
                {getSteps().map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box 
                sx={{ 
                  background: '#f7fafd',
                  borderRadius: 4,
                  p: { xs: 2, sm: 4 },
                  mb: 4,
                  boxShadow: '0 4px 12px rgba(36,81,166,0.04)',
                }}
              >
                {renderStep()}
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                {step > 1 && (
                  <Button
                    variant="outlined"
                    onClick={() => setStep(step - 1)}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderRadius: '999px',
                      fontWeight: 700,
                      borderWidth: 2,
                      color: '#2451a6',
                      borderColor: '#2451a6',
                      '&:hover': {
                        borderWidth: 2,
                        background: '#e3eafc',
                        borderColor: '#2451a6',
                      },
                    }}
                  >
                    Previous
                  </Button>
                )}
                <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                  {step === 2 && userType !== 'room_seeker' ? (
                    formData.property.hasProperty === false ? (
                      <Button
                        variant="outlined"
                        onClick={() => handleNext('skip')}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          borderRadius: '999px',
                          fontWeight: 700,
                          borderWidth: 2,
                          color: '#2451a6',
                          borderColor: '#2451a6',
                          '&:hover': {
                            borderWidth: 2,
                            background: '#e3eafc',
                            borderColor: '#2451a6',
                          },
                        }}
                      >
                        Skip
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => handleNext('listRoomLater')}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          borderRadius: '999px',
                          fontWeight: 700,
                          borderWidth: 2,
                          color: '#2451a6',
                          borderColor: '#2451a6',
                          '&:hover': {
                            borderWidth: 2,
                            background: '#e3eafc',
                            borderColor: '#2451a6',
                          },
                        }}
                      >
                        List Room Later
                      </Button>
                    )
                  ) : (
                    step < 4 ? (
                      <Button
                        variant="contained"
                        onClick={() => handleNext('next')}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          borderRadius: '999px',
                          fontWeight: 700,
                          background: '#2451a6',
                          color: '#fff',
                          boxShadow: '0 4px 14px 0 rgba(36,81,166,0.10)',
                          '&:hover': {
                            background: '#1d3e7a',
                          },
                        }}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        onClick={() => handleNext('complete')}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          borderRadius: '999px',
                          fontWeight: 700,
                          background: '#2451a6',
                          color: '#fff',
                          boxShadow: '0 4px 14px 0 rgba(36,81,166,0.10)',
                          '&:hover': {
                            background: '#1d3e7a',
                          },
                        }}
                      >
                        Complete Profile
                      </Button>
                    )
                  )}
                </Box>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default OnboardingProfile; 