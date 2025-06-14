import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  IconButton,
  InputAdornment,
  FormHelperText,
  Autocomplete,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
  Switch,
  AlertTitle,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from '@mui/icons-material/Close';
import LocationMapModal from '../components/LocationMapModal';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Business as BusinessIcon,
  Home as VillaIcon,
  Hotel as HotelIcon,
  OtherHouses as OtherHousesIcon,
  Bed as BedIcon,
  Chair as ChairIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pets as PetsIcon,
  SmokingRooms as SmokingRoomsIcon,
  LocalParking as LocalParkingIcon,
  Wifi as WifiIcon,
  AcUnit as AcUnitIcon,
  LocalLaundryService as LocalLaundryServiceIcon,
  Security as SecurityIcon,
  Pool as PoolIcon,
  FitnessCenter as FitnessCenterIcon,
  Elevator as ElevatorIcon,
  Balcony as BalconyIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  LocalHospital as LocalHospitalIcon,
  School as SchoolIcon,
  Train as TrainIcon,
  DirectionsBus as DirectionsBusIcon,
  DirectionsSubway as DirectionsSubwayIcon,
  DirectionsCar as DirectionsCarIcon,
  AirportShuttle as AirportShuttleIcon,
  LocalTaxi as LocalTaxiIcon,
  LocalAtm as LocalAtmIcon,
  LocalMall as LocalMallIcon,
  Movie as MovieIcon,
  LocalLibrary as LibraryIcon,
  LocalCafe as CafeIcon,
  LocalGasStation as LocalGasStationIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon,
  LocalShipping as LocalShippingIcon,
  TheaterComedy as TheatreIcon,
  Wc as WcIcon,
} from '@mui/icons-material';

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

const amenitiesOptions = [
  'Furnished',
  'Semi-Furnished',
  'Parking',
  'Security',
  'Power Backup',
  'Lift',
  'Gym',
  'Swimming Pool',
  'Garden',
  '24/7 Water Supply',
  'Gas Pipeline',
  'Internet',
  'Housekeeping',
  'Maintenance Staff',
  'Intercom',
  'Pet Friendly',
  'Wheelchair Accessible',
  'Air Conditioning',
  'Heating',
  'Balcony',
  'Terrace',
  'Modular Kitchen',
  'Wardrobes',
  'TV',
  'Washing Machine',
  'Refrigerator',
  'Sofa',
  'Dining Table',
  'Beds',
  'Study Table',
  'CCTV',
  'Fire Safety',
  'Rain Water Harvesting',
  'Solar Panels',
  'Community Hall',
  'Children\'s Play Area',
  'Party Hall',
  'Temple',
  'Medical Store',
  'Grocery Store',
  'Restaurant',
  'School',
  'Hospital',
  'Metro Station',
  'Bus Stop',
  'Railway Station',
  'Airport',
  'Shopping Mall',
  'Market',
  'Park',
  'Sports Complex',
  'LocalLibrary',
  'Bank',
  'ATM',
  'Post Office',
  'Police Station',
  'Fire Station',
  'Government Office',
  'Private Office',
  'IT Park',
  'Industrial Area',
  'Residential Area',
  'Commercial Area',
  'Mixed Use Area',
  'Gated Community',
  'Independent House',
  'Apartment',
  'Villa',
  'Penthouse',
  'Studio Apartment',
  'Serviced Apartment',
  'Guest House',
  'PG',
  'Hostel',
  'Hotel',
  'Resort',
  'Farm House',
  'Bungalow',
  'Duplex',
  'Triplex',
  'Row House',
  'Townhouse',
  'Condo',
  'Co-op',
  'Timeshare',
  'Vacation Home',
  'Investment Property',
  'Rental Property',
  'Lease Property',
  'Freehold Property',
  'Leasehold Property',
  'Joint Ownership',
  'Single Ownership',
  'Multiple Ownership',
  'Corporate Ownership',
  'Trust Ownership',
  'Society Ownership',
  'Government Ownership',
  'Private Ownership',
  'Public Ownership',
  'Mixed Ownership',
  'Other'
];

const PostListing = () => {
  const navigate = useNavigate();
  const { currentUser, postListing } = useAuth();
  const [showMapModal, setShowMapModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: {
      city: '',
      area: '',
      coordinates: [0, 0],
      formattedAddress: ''
    },
    roomType: '',
    roomSize: '',
    rent: '',
    description: '',
    features: [],
    images: [],
    isReplacementListing: false
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLocationSelect = (location) => {
    console.log('Location selected in PostListing:', location);
    setFormData(prev => ({
      ...prev,
      location: {
        city: location.city,
        area: location.area,
        coordinates: location.coordinates,
        formattedAddress: location.formattedAddress
      }
    }));
    if (errors.location) {
      setErrors(prev => ({
        ...prev,
        location: ''
      }));
    }
  };

  const handleAmenitiesChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      amenities: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - imageFiles.length);
    if (files.length + imageFiles.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setImageFiles(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location.city) newErrors.location = 'Location is required';
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.roomSize) newErrors.roomSize = 'Room size is required';
    if (!formData.rent) newErrors.rent = 'Rent amount is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (imageFiles.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = {
        location: formData.location,
        roomType: formData.roomType,
        roomSize: formData.roomSize,
        rent: formData.rent,
        description: formData.description,
        features: formData.features,
        images: imageFiles
      };

      await postListing(formDataToSend);
      toast.success('Room posted successfully!');
      
      // Reset form
      setFormData({
        location: {
          city: '',
          area: '',
          coordinates: [0, 0],
          formattedAddress: ''
        },
        roomType: '',
        roomSize: '',
        rent: '',
        description: '',
        features: [],
        images: [],
        isReplacementListing: false
      });
      setImageFiles([]);
    } catch (error) {
      console.error('Error posting room:', error);
      toast.error(error.message || 'Failed to post room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e3f2fd 0%, #e8eaf6 100%)',
      py: 6,
    }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(60,72,100,0.10)',
          background: 'rgba(255,255,255,0.95)',
          maxWidth: 1000,
          mx: 'auto',
        }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <HomeIcon color="primary" sx={{ fontSize: 36 }} />
              Post Your Room
            </Box>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
            Share details about your room
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            {/* Replacement Listing Section */}
            <Box sx={{ mb: 4, p: 3, bgcolor: '#f5f7fa', borderRadius: 3, boxShadow: '0 2px 8px 0 rgba(60,72,100,0.04)' }}>
              <FormControl component="fieldset">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircleIcon color="primary" sx={{ fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Is this a replacement listing?
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Select this if you're looking to replace a current roommate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Switch
                    checked={formData.isReplacementListing}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      isReplacementListing: e.target.checked
                    }))}
                    color="primary"
                  />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    Yes, I need a replacement roommate
                  </Typography>
                </Box>
                {formData.isReplacementListing && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>14-Day Replacement Guarantee</AlertTitle>
                    We'll help you find a replacement roommate within 14 days or less! Our matching algorithm prioritizes replacement listings to ensure a smooth transition.
                  </Alert>
                )}
              </FormControl>
            </Box>

            {/* Room Details Section */}
            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BedIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Room Details
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location.formattedAddress || ''}
                  onClick={() => setShowMapModal(true)}
                  onFocus={(e) => e.target.blur()}
                  error={!!errors.location}
                  helperText={errors.location}
                  required
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowMapModal(true)}>
                          <LocationOn />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: '#f7fafd' },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Room Type"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  error={!!errors.roomType}
                  helperText={errors.roomType}
                  select
                  InputProps={{ sx: { borderRadius: 3, bgcolor: '#f7fafd' } }}
                >
                  <MenuItem value="single">Single Room</MenuItem>
                  <MenuItem value="double">Double Sharing</MenuItem>
                  <MenuItem value="triple">Triple Sharing</MenuItem>
                  <MenuItem value="dormitory">Dormitory</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Size (sq ft)"
                  name="roomSize"
                  type="number"
                  value={formData.roomSize}
                  onChange={handleInputChange}
                  error={!!errors.roomSize}
                  helperText={errors.roomSize}
                  InputProps={{ sx: { borderRadius: 3, bgcolor: '#f7fafd' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Rent"
                  name="rent"
                  type="number"
                  value={formData.rent}
                  onChange={handleInputChange}
                  error={!!errors.rent}
                  helperText={errors.rent}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    sx: { borderRadius: 3, bgcolor: '#f7fafd' },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Room Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Describe your room, its features, and what makes it special..."
                  InputProps={{ sx: { borderRadius: 3, bgcolor: '#f7fafd' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Room Features
                </Typography>
                <Autocomplete
                  multiple
                  options={[
                    'Attached Bathroom',
                    'Balcony',
                    'Air Conditioning',
                    'Fan',
                    'Wardrobe',
                    'Study Table',
                    'TV',
                    'WiFi',
                    'Power Backup',
                    'Housekeeping',
                    'Laundry Service',
                    'Food Service',
                    'Security',
                    'Parking'
                  ]}
                  value={formData.features}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      features: newValue
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Add room features"
                      error={!!errors.features}
                      helperText={errors.features}
                      InputProps={{ ...params.InputProps, sx: { borderRadius: 3, bgcolor: '#f7fafd' } }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                />
              </Grid>
            </Grid>

            {/* Room Photos Section */}
            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 2 }}>
              <AddAPhotoIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Room Photos
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="room-photos"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />
                <label htmlFor="room-photos">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<AddIcon />}
                    disabled={imageFiles.length >= 5}
                    sx={{
                      borderRadius: '999px',
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      fontSize: '1rem',
                      background: '#f7fafd',
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      '&:hover': { background: '#e3f2fd' },
                      transition: 'all 0.18s',
                    }}
                  >
                    Add Photos (Max 5)
                  </Button>
                </label>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  Upload clear photos of your room, common areas, and amenities
                </Typography>
              </Grid>
              {imageFiles.map((file, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    borderRadius: 4,
                    boxShadow: '0 4px 16px 0 rgba(60,72,100,0.10)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={URL.createObjectURL(file)}
                      alt={`Room photo ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', boxShadow: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  mt: 4,
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  py: 1.5,
                  background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
                  boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)',
                  '&:hover': { background: 'linear-gradient(90deg, #48c6ef 0%, #6c63ff 100%)' },
                  transition: 'all 0.18s',
                }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Post Room'}
              </Button>
            </Grid>
          </Box>
        </Paper>
        <LocationMapModal
          open={showMapModal}
          onClose={() => setShowMapModal(false)}
          onSelectLocation={handleLocationSelect}
          initialLocation={formData.location}
        />
      </Container>
    </Box>
  );
};

export default PostListing;