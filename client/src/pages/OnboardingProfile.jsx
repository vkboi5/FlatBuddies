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
      }
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
    setUserType(type);
    setShowUserTypeModal(false);
    setFormData(prev => ({
      ...prev,
      userType: type
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
          return formData.preferences.budget.min && formData.preferences.budget.max;
        } else {
          return formData.preferences.budget.min;
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

  const handleNext = () => {
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

    if (validateStep(step)) {
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
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        city: selectedLocation.city,
        area: selectedLocation.area,
        coordinates: selectedLocation.coordinates,
      }
    }));
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location.city ? `${formData.location.city}${formData.location.area ? ', ' + formData.location.area : ''}` : ''}
                  onClick={() => setShowMapModal(true)}
                  onFocus={(e) => e.target.blur()}
                  readOnly
                  variant="outlined"
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="interests-label">Interests</InputLabel>
                  <Select
                    labelId="interests-label"
                    multiple
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Interests" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
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
              <Grid item xs={12}>
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
              {userType === 'room_seeker' ? 'Location & Budget' : 'Location & Property Details'}
            </Typography>
            <Grid container spacing={3}>
              {userType === 'room_seeker' ? (
                <>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Budget Range (₹)</Typography>
                    <Slider
                      value={[formData.preferences.budget.min, formData.preferences.budget.max]}
                      onChange={(e, newValue) => setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          budget: {
                            min: newValue[0],
                            max: newValue[1]
                          }
                        }
                      }))}
                      valueLabelDisplay="auto"
                      min={1000}
                      max={100000}
                      step={1000}
                      disableSwap
                />
              </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                <TextField
                  fullWidth
                    label="Rent Amount"
                  type="number"
                    name="preferences.budget.min"
                    value={formData.preferences.budget.min}
                  onChange={handleInputChange}
                  variant="outlined"
                    required
                />
              </Grid>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
        backgroundColor: 'grey.50',
        py: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={step - 1} alternativeLabel>
                {getSteps().map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              {step > 1 && (
                <Button
                  variant="outlined"
                  onClick={() => setStep(step - 1)}
                  sx={{ px: 3, py: 1, borderRadius: '8px' }}
                >
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button
                  variant="contained"
                    onClick={handleNext}
                  sx={{ ml: 'auto', px: 3, py: 1, borderRadius: '8px' }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ ml: 'auto', px: 3, py: 1, borderRadius: '8px' }}
                >
                  Complete Profile
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
    </>
  );
};

export default OnboardingProfile; 