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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser, userProfile, updateProfile, updateUserType } = useAuth();
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      // Initialize form with existing userProfile data, including userType
      setForm({
        name: userProfile.name || '',
        dob: userProfile.profile?.age ? new Date(new Date().getFullYear() - userProfile.profile.age, 0, 1).toISOString().split('T')[0] : '', // Approximate DOB from age
        gender: userProfile.profile?.gender || '',
        location: userProfile.profile?.location?.city || '',
        bio: userProfile.profile?.bio || '',
        userType: userProfile.userType || 'room_seeker', // Ensure userType is initialized
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
    setForm((prev) => ({ ...prev, [name]: value }));
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
          {/* New User Type Selection */}
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