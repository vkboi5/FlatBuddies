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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaBroom, FaUsers, FaLaptop, FaBuilding } from 'react-icons/fa';

export default function Profile() {
  const { currentUser, userProfile, updateProfile, updateUserType } = useAuth();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      // Initialize form with existing userProfile data, including userType and lifestyle preferences
      setForm({
        name: userProfile.name || '',
        dob: userProfile.profile?.age ? new Date(new Date().getFullYear() - userProfile.profile.age, 0, 1).toISOString().split('T')[0] : '',
        gender: userProfile.profile?.gender || '',
        location: userProfile.profile?.location?.city || '',
        bio: userProfile.profile?.bio || '',
        userType: userProfile.userType || 'room_seeker',
        preferences: {
          lifestyle: {
            cleanliness: userProfile.profile?.preferences?.lifestyle?.cleanliness || 5,
            socialLevel: userProfile.profile?.preferences?.lifestyle?.socialLevel || 5,
            workMode: userProfile.profile?.preferences?.lifestyle?.workMode || 'office',
          }
        }
      });
    }
  }, [userProfile]);

  if (!form) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
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

      // Prepare profile data to send to backend
      const profileData = {
        name: form.name,
        profile: {
          age: form.dob ? new Date().getFullYear() - new Date(form.dob).getFullYear() : undefined,
          gender: form.gender,
          location: {
            city: form.location,
            area: '', // Assuming area is not edited here
          },
          bio: form.bio,
          preferences: {
            lifestyle: form.preferences.lifestyle
          }
        },
      };

      // Update the main profile fields
      await updateProfile(profileData);

      // Update user type separately if it changed
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

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            required
          />
          <TextField
            label="Date of Birth"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled={!editing}
            required
          />
          <FormControl fullWidth required disabled={!editing}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={form.gender}
              label="Gender"
              onChange={handleChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required disabled={!editing}>
            <InputLabel>Location</InputLabel>
            <Select
              name="location"
              value={form.location}
              label="Location"
              onChange={handleChange}
            >
              <MenuItem value="Nagpur">Nagpur</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required disabled={!editing}>
            <InputLabel>Looking For</InputLabel>
            <Select
              name="userType"
              value={form.userType}
              label="Looking For"
              onChange={handleChange}
            >
              <MenuItem value="room_seeker">Flats</MenuItem>
              <MenuItem value="room_provider">Flatmates</MenuItem>
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
          />

          {/* Lifestyle Preferences Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lifestyle Preferences
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {/* Cleanliness Level */}
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

            {/* Social Level */}
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

            {/* Work Mode */}
            <FormControl fullWidth disabled={!editing}>
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
          </Box>

          {editing ? (
            <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
} 