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
  OutlinedInput,
  IconButton,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaBroom, FaUsers } from 'react-icons/fa';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import LocationMapModal from '../components/LocationMapModal';
import UserTypeModal from '../components/UserTypeModal';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
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
      background: '#f5f8fd',
      py: 7,
    }}>
      <Container maxWidth="md">
        <Paper sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(36,81,166,0.10)',
          background: '#fff',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={photoPreview}
                sx={{
                  width: 120,
                  height: 120,
                  boxShadow: '0 4px 24px 0 rgba(36,81,166,0.10)',
                  border: '4px solid #fff',
                }}
              />
              {editing && (
                <IconButton
                  component="label"
                  htmlFor="personal-photo-upload"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#2451a6',
                    color: '#fff',
                    '&:hover': { bgcolor: '#1d3e7a' }
                  }}
                >
                  <AddAPhotoIcon />
                </IconButton>
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: '#2451a6', letterSpacing: 1 }}>
                My Profile
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ({form.userType === 'room_seeker' ? 'Looking for a room' : 'Looking for a roommate'})
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setShowUserTypeChangeModal(true)}
              sx={{ ml: { xs: 0, sm: 'auto' }, mt: { xs: 2, sm: 0 }, borderRadius: '999px', fontWeight: 600, px: 3, py: 1.2, fontSize: '1rem', borderColor: '#2451a6', color: '#2451a6', '&:hover': { background: '#e3f2fd', borderColor: '#2451a6' }, transition: 'all 0.18s' }}
            >
              Change Role
            </Button>
          </Box>
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? '#fff' : '#f7fafd' } }}
                />
                <TextField
                  label="Age"
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? '#fff' : '#f7fafd' } }}
                />
                <TextField
                  label="Occupation"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  disabled={!editing}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? '#fff' : '#f7fafd' } }}
                />
                <FormControl fullWidth required disabled={!editing}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={form.gender}
                    label="Gender"
                    onChange={handleChange}
                    sx={{ borderRadius: 3, bgcolor: editing ? '#fff' : '#f7fafd' }}
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
                    sx: { borderRadius: 3, bgcolor: editing ? '#fff' : '#f7fafd', cursor: editing ? 'pointer' : 'default' },
                  }}
                />
                <TextField
                  label="Bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  multiline
                  minRows={4}
                  disabled={!editing}
                  InputProps={{ sx: { borderRadius: 3, bgcolor: editing ? '#fff' : '#f7fafd' } }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  id="personal-photo-upload"
                  disabled={!editing}
                />
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
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
                          <Chip key={value} label={value} sx={{ borderRadius: '999px', bgcolor: '#e3eafc', color: '#2451a6', fontWeight: 600 }} />
                        ))}
                      </Box>
                    )}
                    sx={{ borderRadius: 3, bgcolor: editing ? '#fff' : '#f7fafd' }}
                  >
                    {interestsOptions.map((interest) => (
                      <MenuItem
                        key={interest}
                        value={interest}
                      >
                        {interest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Paper sx={{ mt: 2, bgcolor: '#f7fafd', borderRadius: 4, p: 3, boxShadow: 'none' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#2451a6', mb: 2 }}>
                    Lifestyle Preferences
                  </Typography>
                  <Stack spacing={3}>
                    <Box>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <FaBroom size={20} color="#2451a6" />
                        <Typography variant="subtitle1">Cleanliness Level</Typography>
                      </Stack>
                      <Slider
                        value={form.preferences.lifestyle.cleanliness}
                        onChange={handleSliderChange('cleanliness')}
                        disabled={!editing}
                        min={1} max={10} marks valueLabelDisplay="auto"
                        sx={{ color: '#2451a6' }}
                      />
                    </Box>
                    <Box>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <FaUsers size={20} color="#2451a6" />
                        <Typography variant="subtitle1">Social Level</Typography>
                      </Stack>
                      <Slider
                        value={form.preferences.lifestyle.socialLevel}
                        onChange={handleSliderChange('socialLevel')}
                        disabled={!editing}
                        min={1} max={10} marks valueLabelDisplay="auto"
                        sx={{ color: '#2451a6' }}
                      />
                    </Box>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Work Mode</InputLabel>
                      <Select name="preferences.lifestyle.workMode" value={form.preferences.lifestyle.workMode} onChange={handleChange} label="Work Mode">
                        <MenuItem value="wfh">Work from Home</MenuItem>
                        <MenuItem value="office">Office Work</MenuItem>
                        <MenuItem value="hybrid">Hybrid Work</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Smoking</InputLabel>
                      <Select name="preferences.lifestyle.smoking" value={form.preferences.lifestyle.smoking} onChange={handleChange} label="Smoking">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Pets</InputLabel>
                      <Select name="preferences.lifestyle.pets" value={form.preferences.lifestyle.pets} onChange={handleChange} label="Pets">
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth disabled={!editing}>
                      <InputLabel>Food Preference</InputLabel>
                      <Select name="preferences.lifestyle.foodPreference" value={form.preferences.lifestyle.foodPreference} onChange={handleChange} label="Food Preference">
                        <MenuItem value="vegetarian">Vegetarian</MenuItem>
                        <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
                        <MenuItem value="vegan">Vegan</MenuItem>
                        <MenuItem value="any">Any</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Paper>

                {form.userType === 'room_seeker' && (
                  <Paper sx={{ mt: 2, bgcolor: '#f7fafd', borderRadius: 4, p: 3, boxShadow: 'none' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#2451a6', mb: 2 }}>
                      Budget & Roommate Preferences
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography gutterBottom>Budget Range (₹{form.preferences.budget.min} - ₹{form.preferences.budget.max})</Typography>
                        <Slider
                          value={[form.preferences.budget.min, form.preferences.budget.max]}
                          onChange={(e, newValue) => setForm(prev => ({ ...prev, preferences: { ...prev.preferences, budget: { min: newValue[0], max: newValue[1] } } }))}
                          valueLabelDisplay="auto"
                          min={1000} max={100000} step={1000}
                          disableSwap disabled={!editing}
                          sx={{ color: '#2451a6' }}
                        />
                      </Box>
                      <FormControl fullWidth variant="outlined" required disabled={!editing}>
                        <InputLabel>Preferred Gender</InputLabel>
                        <Select
                          name="preferences.roommates.gender"
                          value={form.preferences.roommates.gender}
                          onChange={handleChange}
                          label="Preferred Gender"
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="any">Any</MenuItem>
                        </Select>
                      </FormControl>
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
                    </Stack>
                  </Paper>
                )}

              </Stack>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {editing ? (
              <>
                <Button variant="text" onClick={() => setEditing(false)} sx={{ color: '#555' }}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ borderRadius: '999px', fontWeight: 700, fontSize: '1.1rem', py: 1.5, px: 4, background: '#2451a6', boxShadow: '0 2px 8px 0 rgba(36,81,166,0.10)', '&:hover': { background: '#1d3e7a' }, transition: 'all 0.18s' }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setEditing(true)}
                sx={{ borderRadius: '999px', fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1rem', background: '#2451a6', color: '#fff', '&:hover': { background: '#1d3e7a' }, transition: 'all 0.18s' }}
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