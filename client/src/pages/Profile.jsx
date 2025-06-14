import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Slider,
  Stack,
  Divider,
  Grid,
  Chip,
  Avatar,
  Autocomplete,
  OutlinedInput,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaBroom, FaUsers, FaLaptop, FaBuilding } from 'react-icons/fa';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import LocationMapModal from '../components/LocationMapModal';
import UserTypeModal from '../components/UserTypeModal';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';

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

const filterOptions = createFilterOptions();

export default function Profile() {
  const { currentUser, userProfile, updateProfile, updateUserType, profileLoading } = useAuth();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showUserTypeChangeModal, setShowUserTypeChangeModal] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && !profileLoading) {
      setForm({
        name: userProfile.name || '',
        age: userProfile.profile?.age || 0,
        gender: userProfile.profile?.gender || '',
        occupation: userProfile.profile?.occupation || '',
        bio: userProfile.profile?.bio || '',
        photos: userProfile.profile?.photos || [],
        interests: userProfile.profile?.interests || [],
        location: {
          type: userProfile.profile?.location?.type || 'Point',
          coordinates: userProfile.profile?.location?.coordinates || [0, 0],
          city: userProfile.profile?.location?.city || '',
          area: userProfile.profile?.location?.area || '',
        },
        userType: userProfile.userType || 'room_seeker',
        preferences: {
          budget: {
            min: userProfile.profile?.preferences?.budget?.min || 0,
            max: userProfile.profile?.preferences?.budget?.max || 0,
          },
          roommates: {
            gender: userProfile.profile?.preferences?.roommates?.gender || '',
            ageRange: {
              min: userProfile.profile?.preferences?.roommates?.ageRange?.min || 0,
              max: userProfile.profile?.preferences?.roommates?.ageRange?.max || 0,
            }
          },
          lifestyle: {
            cleanliness: userProfile.profile?.preferences?.lifestyle?.cleanliness || 5,
            socialLevel: userProfile.profile?.preferences?.lifestyle?.socialLevel || 5,
            workMode: userProfile.profile?.preferences?.lifestyle?.workMode || 'office',
            smoking: userProfile.profile?.preferences?.lifestyle?.smoking || 'no',
            pets: userProfile.profile?.preferences?.lifestyle?.pets || 'no',
            foodPreference: userProfile.profile?.preferences?.lifestyle?.foodPreference || 'any',
          }
        }
      });
      if (userProfile.profile?.photos && userProfile.profile.photos.length > 0) {
        setPhotoPreview(userProfile.profile.photos[0]);
      }
      setInitialLoad(false);
    }
  }, [userProfile, profileLoading]);

  if (initialLoad || profileLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading profile...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!currentUser || !userProfile) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Profile not found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Preparing your profile...
          </Typography>
        </Paper>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = e.target.type === 'number' && value === '' ? 0 : value;

    if (name.includes('.')) {
      const [parent, child, grandChild] = name.split('.');
      if (parent === 'location' && (child === 'city' || child === 'area')) {
        return;
      }
      if (grandChild) {
        setForm(prev => ({
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
        setForm(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: processedValue
          }
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: processedValue }));
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    setForm(prev => ({
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

  const handleSliderChange = (name) => (event, newValue) => {
    setForm(prev => ({
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

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!currentUser || !userProfile) {
        throw new Error("User not authenticated or profile not loaded.");
      }

      let photoUrl = '';
      if (photoFile) {
        const storageRef = ref(storage, `profile_photos/${currentUser.uid}/${photoFile.name}`);
        const snapshot = await uploadBytes(storageRef, photoFile);
        photoUrl = await getDownloadURL(snapshot.ref);
        toast.success('Personal photo uploaded!');
      } else if (photoPreview) {
        photoUrl = form.photos[0] || '';
      }

      const profileData = {
        name: form.name,
        userType: form.userType,
        onboarded: true,
        profile: {
          age: parseInt(form.age),
          gender: form.gender,
          occupation: form.occupation,
          bio: form.bio,
          photos: photoUrl ? [photoUrl] : [],
          interests: form.interests,
          location: {
            type: form.location.type,
            coordinates: form.location.coordinates,
            city: form.location.city,
            area: form.location.area,
          },
          preferences: {
            budget: {
              min: parseInt(form.preferences.budget.min),
              max: parseInt(form.preferences.budget.max),
            },
            roommates: {
              gender: form.preferences.roommates.gender,
              ageRange: {
                min: parseInt(form.preferences.roommates.ageRange.min),
                max: parseInt(form.preferences.roommates.ageRange.max),
              }
            },
            lifestyle: {
              cleanliness: form.preferences.lifestyle.cleanliness,
              socialLevel: form.preferences.lifestyle.socialLevel,
              workMode: form.preferences.lifestyle.workMode,
              smoking: form.preferences.lifestyle.smoking,
              pets: form.preferences.lifestyle.pets,
              foodPreference: form.preferences.lifestyle.foodPreference,
            }
          }
        },
      };

      await updateProfile(profileData);

      if (form.userType !== userProfile.userType) {
        await updateUserType(form.userType);
      }
      
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUserTypeChange = async (selectedUserType) => {
    setSaving(true);
    try {
      await updateUserType(selectedUserType);
      setForm(prev => ({
        ...prev,
        userType: selectedUserType,
      }));
      toast.success('User type updated successfully!');
    } catch (error) {
      toast.error('Failed to update user type.');
      console.error('Error updating user type:', error);
    } finally {
      setSaving(false);
      setShowUserTypeChangeModal(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e3f2fd 0%, #e8eaf6 100%)',
      py: 7,
    }}>
      <Container maxWidth="sm">
        <Paper sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(60,72,100,0.10)',
          background: 'rgba(255,255,255,0.97)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <Avatar
              src={photoPreview}
              sx={{
                width: 90,
                height: 90,
                boxShadow: '0 4px 16px 0 rgba(60,72,100,0.10)',
                border: '3px solid #e3e6f3',
                mr: 2,
              }}
            />
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 1 }}>
                My Profile
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ({form.userType === 'room_seeker' ? 'Looking for a room' : 'Looking for a roommate'})
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setShowUserTypeChangeModal(true)}
              sx={{ ml: 'auto', borderRadius: '999px', fontWeight: 600, px: 3, py: 1.2, fontSize: '1rem', borderColor: 'primary.main', color: 'primary.main', '&:hover': { background: '#e3f2fd' }, transition: 'all 0.18s' }}
            >
              Change User Type
            </Button>
          </Box>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
              required
              InputProps={{ sx: { borderRadius: 3, bgcolor: '#f7fafd' } }}
            />
            <TextField
              label="Age"
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              disabled={!editing}
              required
              InputProps={{ sx: { borderRadius: 3, bgcolor: '#f7fafd' } }}
            />
            <TextField
              label="Occupation"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              disabled={!editing}
              variant="outlined"
              InputProps={{ sx: { borderRadius: 3, bgcolor: '#f7fafd' } }}
            />
            <FormControl fullWidth required disabled={!editing}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={form.gender}
                label="Gender"
                onChange={handleChange}
                sx={{ borderRadius: 3, bgcolor: '#f7fafd' }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Location"
              value={form.location.city ? `${form.location.city}${form.location.area ? ', ' + form.location.area : ''}` : ''}
              onClick={() => editing && setShowMapModal(true)}
              onFocus={(e) => e.target.blur()}
              readOnly
              variant="outlined"
              required
              disabled={!editing}
              InputProps={{
                readOnly: true,
                sx: { borderRadius: 3, bgcolor: '#f7fafd' },
              }}
            />
            <FormControl fullWidth disabled={!editing}>
              <InputLabel id="interests-label">Interests</InputLabel>
              <Select
                labelId="interests-label"
                multiple
                name="interests"
                value={form.interests}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Interests" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                sx={{ borderRadius: 3, bgcolor: '#f7fafd' }}
              >
                {interestsOptions.map((interest) => (
                  <MenuItem
                    key={interest}
                    value={interest}
                    style={{
                      fontWeight: form.interests.indexOf(interest) === -1
                        ? 'normal'
                        : 'bold',
                    }}
                  >
                    {interest}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              multiline
              minRows={3}
              disabled={!editing}
              InputProps={{ sx: { borderRadius: 3, bgcolor: '#f7fafd' } }}
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Personal Photo
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                id="personal-photo-upload"
                disabled={!editing}
              />
              <label htmlFor="personal-photo-upload">
                <Button variant="outlined" component="span" startIcon={<AddAPhotoIcon />} disabled={!editing}
                  sx={{ borderRadius: '999px', fontWeight: 600, px: 3, py: 1.2, fontSize: '1rem', borderColor: 'primary.main', color: 'primary.main', '&:hover': { background: '#e3f2fd' }, transition: 'all 0.18s' }}
                >
                  Upload Photo
                </Button>
              </label>
              {photoPreview && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar src={photoPreview} sx={{ width: 80, height: 80, mr: 2, boxShadow: '0 4px 16px 0 rgba(60,72,100,0.10)', border: '2px solid #e3e6f3' }} />
                  {editing && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        setForm(prev => ({ ...prev, photos: [] }));
                      }}
                    >
                      Remove Photo
                    </Button>
                  )}
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 2, bgcolor: '#f5f7fa', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(60,72,100,0.04)' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                Lifestyle Preferences
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <FaBroom size={20} color="#666" />
                  <Typography variant="subtitle1">Cleanliness Level</Typography>
                </Stack>
                <Slider
                  value={form.preferences.lifestyle.cleanliness}
                  onChange={handleSliderChange('cleanliness')}
                  disabled={!editing}
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
                  {form.preferences.lifestyle.cleanliness === 1 ? 'Very Relaxed' :
                   form.preferences.lifestyle.cleanliness === 10 ? 'Very Clean' :
                   'Moderate'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <FaUsers size={20} color="#666" />
                  <Typography variant="subtitle1">Social Level</Typography>
                </Stack>
                <Slider
                  value={form.preferences.lifestyle.socialLevel}
                  onChange={handleSliderChange('socialLevel')}
                  disabled={!editing}
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
                  {form.preferences.lifestyle.socialLevel === 1 ? 'Very Private' :
                   form.preferences.lifestyle.socialLevel === 10 ? 'Very Social' :
                   'Moderate'}
                </Typography>
              </Box>

              <FormControl fullWidth disabled={!editing} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  {form.preferences.lifestyle.workMode === 'wfh' ? (
                    <FaLaptop size={20} color="#666" />
                  ) : form.preferences.lifestyle.workMode === 'office' ? (
                    <FaBuilding size={20} color="#666" />
                  ) : (
                    <FaUsers size={20} color="#666" />
                  )}
                  <Typography variant="subtitle1">Work Mode</Typography>
                </Stack>
                <Select
                  name="preferences.lifestyle.workMode"
                  value={form.preferences.lifestyle.workMode}
                  onChange={handleChange}
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="wfh">Work from Home</MenuItem>
                  <MenuItem value="office">Office Work</MenuItem>
                  <MenuItem value="hybrid">Hybrid Work</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" disabled={!editing} sx={{ mb: 3 }}>
                <InputLabel>Smoking</InputLabel>
                <Select
                  name="preferences.lifestyle.smoking"
                  value={form.preferences.lifestyle.smoking}
                  onChange={handleChange}
                  label="Smoking"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" disabled={!editing} sx={{ mb: 3 }}>
                <InputLabel>Pets</InputLabel>
                <Select
                  name="preferences.lifestyle.pets"
                  value={form.preferences.lifestyle.pets}
                  onChange={handleChange}
                  label="Pets"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" disabled={!editing} sx={{ mb: 3 }}>
                <InputLabel>Food Preference</InputLabel>
                <Select
                  name="preferences.lifestyle.foodPreference"
                  value={form.preferences.lifestyle.foodPreference}
                  onChange={handleChange}
                  label="Food Preference"
                >
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
                  <MenuItem value="vegan">Vegan</MenuItem>
                  <MenuItem value="any">Any</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {form.userType === 'room_seeker' && (
              <Box sx={{ mt: 2, bgcolor: '#f5f7fa', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(60,72,100,0.04)' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Budget & Roommate Preferences
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Budget Range (₹)</Typography>
                    <Slider
                      value={[form.preferences.budget.min, form.preferences.budget.max]}
                      onChange={(e, newValue) => setForm(prev => ({
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
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required disabled={!editing}>
                      <InputLabel>Preferred Gender</InputLabel>
                      <Select
                        name="preferences.roommates.gender"
                        value={form.preferences.roommates.gender}
                        onChange={handleChange}
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
                        value={form.preferences.roommates.ageRange.min}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        disabled={!editing}
                      />
                      <TextField
                        fullWidth
                        label="Max Age"
                        type="number"
                        name="preferences.roommates.ageRange.max"
                        value={form.preferences.roommates.ageRange.max}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        disabled={!editing}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {form.userType === 'room_provider' && (
              <Box sx={{ mt: 2, bgcolor: '#f5f7fa', borderRadius: 3, p: 3, boxShadow: '0 2px 8px 0 rgba(60,72,100,0.04)' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Property Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Rent Amount"
                    type="number"
                    name="preferences.budget.min"
                    value={form.preferences.budget.min}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    disabled={!editing}
                  />
                </Grid>
              </Box>
            )}

            {editing ? (
              <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ borderRadius: '999px', fontWeight: 700, fontSize: '1.1rem', py: 1.5, background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)', boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)', '&:hover': { background: 'linear-gradient(90deg, #48c6ef 0%, #6c63ff 100%)' }, transition: 'all 0.18s' }}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => setEditing(true)}
                sx={{ borderRadius: '999px', fontWeight: 700, px: 3, py: 1.2, fontSize: '1rem', borderColor: 'primary.main', color: 'primary.main', '&:hover': { background: '#e3f2fd' }, transition: 'all 0.18s' }}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
      <LocationMapModal
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelectLocation={handleLocationSelect}
        initialLocation={form.location}
      />
      <UserTypeModal
        open={showUserTypeChangeModal}
        onSelect={handleUserTypeChange}
      />
    </Box>
  );
} 