import React, { useState } from 'react';
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
} from '@mui/material';
import {
  FaUser, FaHome, FaHeart, FaSmoking, FaPaw, FaUtensils,
} from 'react-icons/fa';

const OnboardingProfile = () => {
  const navigate = useNavigate();
  const { updateProfile, currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    age: '',
    gender: '',
    occupation: '',
    bio: '',
    photos: [],
    
    // Location
    location: {
      city: '',
      area: '',
      preferredLocations: []
    },
    
    // Living Preferences
    budget: {
      min: '',
      max: ''
    },
    moveInDate: '',
    stayDuration: '',
    
    // Lifestyle
    lifestyle: {
      smoking: '',
      pets: '',
      foodPreference: '',
      cleanlinessPreference: '',
      sleepSchedule: '',
      socialPreference: ''
    },
    
    // Roommate Preferences
    roommatePreferences: {
      gender: '',
      ageRange: {
        min: '',
        max: ''
      },
      occupation: '',
      smoking: '',
      pets: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle photo upload logic here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Current user UID before updateProfile:', currentUser?.uid);
      await updateProfile(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderStep = () => {
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
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
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
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor="photo-upload">
                    Photos
                  </InputLabel>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    id="photo-upload"
                  />
                </FormControl>
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
              Location & Budget
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Area"
                  name="location.area"
                  value={formData.location.area}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Budget"
                  type="number"
                  name="budget.min"
                  value={formData.budget.min}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Budget"
                  type="number"
                  name="budget.max"
                  value={formData.budget.max}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Smoking</InputLabel>
                  <Select
                    name="lifestyle.smoking"
                    value={formData.lifestyle.smoking}
                    onChange={handleInputChange}
                    label="Smoking"
                  >
                    <MenuItem value="">Select preference</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                    <MenuItem value="sometimes">Sometimes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Pets</InputLabel>
                  <Select
                    name="lifestyle.pets"
                    value={formData.lifestyle.pets}
                    onChange={handleInputChange}
                    label="Pets"
                  >
                    <MenuItem value="">Select preference</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                    <MenuItem value="open">Open to discussion</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Food Preference</InputLabel>
                  <Select
                    name="lifestyle.foodPreference"
                    value={formData.lifestyle.foodPreference}
                    onChange={handleInputChange}
                    label="Food Preference"
                  >
                    <MenuItem value="">Select preference</MenuItem>
                    <MenuItem value="veg">Vegetarian</MenuItem>
                    <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Cleanliness Preference</InputLabel>
                  <Select
                    name="lifestyle.cleanlinessPreference"
                    value={formData.lifestyle.cleanlinessPreference}
                    onChange={handleInputChange}
                    label="Cleanliness Preference"
                  >
                    <MenuItem value="">Select preference</MenuItem>
                    <MenuItem value="very_clean">Very Clean</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="relaxed">Relaxed</MenuItem>
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Preferred Gender</InputLabel>
                  <Select
                    name="roommatePreferences.gender"
                    value={formData.roommatePreferences.gender}
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
                    name="roommatePreferences.ageRange.min"
                    value={formData.roommatePreferences.ageRange.min}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Max Age"
                    type="number"
                    name="roommatePreferences.ageRange.max"
                    value={formData.roommatePreferences.ageRange.max}
                    onChange={handleInputChange}
                    variant="outlined"
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
              {[1, 2, 3, 4].map((s) => (
                <Step key={s}>
                  <StepLabel>{`Step ${s}`}</StepLabel>
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
                  onClick={() => setStep(step + 1)}
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
  );
};

export default OnboardingProfile; 