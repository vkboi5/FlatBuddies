import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  Slider,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Re-initialize Firebase app to get storage instance if not already globally accessible
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

const amenities = [
  'Furnished',
  'Parking',
  'Gym',
  'Swimming Pool',
  'Security',
  'Power Backup',
  'Lift',
  'Internet',
  'Housekeeping',
  'Laundry',
];

export default function PostListing({ open, onClose, userType }) {
  const { postListing, currentUser, updateUserType } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    roomType: 'single',
    availableFrom: '',
    amenities: [],
    preferences: {
      gender: 'any',
      ageRange: [18, 60],
      occupation: 'any',
    },
    images: [],
  });
  const [listingImages, setListingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value,
      },
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    setListingImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newImagePreviews]);
  };

  const handleRemoveImage = (index) => {
    setListingImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let uploadedImageUrls = [];
      if (listingImages.length > 0 && currentUser) {
        for (const imageFile of listingImages) {
          const storageRef = ref(storage, `listing_photos/${currentUser.uid}/${imageFile.name}`);
          const snapshot = await uploadBytes(storageRef, imageFile);
          const downloadURL = await getDownloadURL(snapshot.ref);
          uploadedImageUrls.push(downloadURL);
        }
        toast.success('Listing images uploaded!');
      }

      const listingPayload = {
        roomDetails: {
          name: formData.title,
          description: formData.description,
          rent: parseFloat(formData.price),
          address: formData.location,
          roomType: formData.roomType,
          availableFrom: formData.availableFrom,
          amenities: formData.amenities,
          photos: uploadedImageUrls,
        },
        preferences: formData.preferences,
        userType: 'room_provider',
      };

      await postListing(listingPayload);

      if (userType !== 'room_provider') {
        await updateUserType('room_provider');
      }

      toast.success('Listing posted successfully!');
      onClose();
    } catch (error) {
      console.error('Error posting listing:', error);
      toast.error(error.message || 'Failed to post listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Post New Listing
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price per month"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <Typography>₹</Typography>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="single">Single Room</MenuItem>
                  <MenuItem value="double">Double Sharing</MenuItem>
                  <MenuItem value="triple">Triple Sharing</MenuItem>
                  <MenuItem value="entire">Entire Flat</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Available From"
                name="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Amenities
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {amenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                    variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.preferences.gender}
                      onChange={(e) => handlePreferenceChange('gender', e.target.value)}
                    >
                      <MenuItem value="any">Any</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Occupation</InputLabel>
                    <Select
                      value={formData.preferences.occupation}
                      onChange={(e) => handlePreferenceChange('occupation', e.target.value)}
                    >
                      <MenuItem value="any">Any</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="working">Working Professional</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography gutterBottom>Age Range</Typography>
                  <Slider
                    value={formData.preferences.ageRange}
                    onChange={(e, newValue) => handlePreferenceChange('ageRange', newValue)}
                    valueLabelDisplay="auto"
                    min={18}
                    max={60}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Listing Photos
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="listing-image-upload"
              />
              <label htmlFor="listing-image-upload">
                <Button variant="outlined" component="span" startIcon={<AddIcon />}>
                  Add Photos
                </Button>
              </label>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {imagePreviews.map((src, index) => (
                  <Chip
                    key={index}
                    label={`Image ${index + 1}`}
                    onDelete={() => handleRemoveImage(index)}
                    avatar={<Avatar src={src} alt={`Listing Image ${index + 1}`} />}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Listing'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 