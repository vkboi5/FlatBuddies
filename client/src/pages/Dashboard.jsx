import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  SwapHoriz as SwapIcon,
  Settings as SettingsIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ListingDetail from '../components/ListingDetail';
import PostListing from '../components/PostListing';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [selectedFlow, setSelectedFlow] = useState('flat');
  const [radius, setRadius] = useState(10);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout, currentUser, userChoice, userProfile } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedListing, setSelectedListing] = useState(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    roomType: 'any',
    gender: 'any',
    occupation: 'any',
  });
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUser || !userProfile || !userChoice) return;

      try {
        const token = await currentUser.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userType: userChoice === 'flat' ? 'room_provider' : 'room_seeker',
          },
        };
        const response = await axios.get(
          'http://localhost:5000/api/profiles/potential-matches',
          config
        );
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error('Failed to load listings.');
      }
    };

    fetchListings();
  }, [currentUser, userProfile, userChoice]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredListings = listings.filter((listing) => {
    const nameOrTitle = listing.userType === 'room_seeker' ? listing.profile?.name : listing.roomDetails?.name;
    const location = listing.userType === 'room_seeker' ? listing.profile?.location?.address : listing.roomDetails?.location?.address;
    const price = listing.roomDetails?.rent || 0;

    const matchesSearch = (nameOrTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

    const matchesGender = filters.gender === 'any' || 
                          (listing.userType === 'room_seeker' && listing.profile?.gender === filters.gender) ||
                          (listing.userType === 'room_provider' && listing.preferences?.roommates?.gender === filters.gender);
                         
    const matchesOccupation = filters.occupation === 'any' || 
                              (listing.userType === 'room_seeker' && listing.profile?.occupation === filters.occupation) ||
                              (listing.userType === 'room_provider' && listing.preferences?.roommates?.occupation === filters.occupation);

    return matchesSearch && matchesPrice && matchesGender && matchesOccupation;
  });

  const FilterDrawer = () => (
    <Drawer
      anchor="right"
      open={isFilterDrawerOpen}
      onClose={() => setIsFilterDrawerOpen(false)}
      PaperProps={{
        sx: { width: isMobile ? '80%' : '30%', p: 3 },
      }}
    >
      <Typography variant="h6" gutterBottom>Filters</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Room Type</InputLabel>
        <Select
          name="roomType"
          value={filters.roomType}
          label="Room Type"
          onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
        >
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="1RK">1RK</MenuItem>
          <MenuItem value="1BHK">1BHK</MenuItem>
          <MenuItem value="2BHK">2BHK</MenuItem>
          <MenuItem value="3BHK">3BHK</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={filters.gender}
          label="Gender"
          onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
        >
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Occupation</InputLabel>
        <Select
          name="occupation"
          value={filters.occupation}
          label="Occupation"
          onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
        >
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="working">Working Professional</MenuItem>
        </Select>
      </FormControl>
      <Typography gutterBottom sx={{ mt: 2 }}>Price Range</Typography>
      <Slider
        value={priceRange}
        onChange={(_, newValue) => setPriceRange(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={50000}
        step={1000}
        marks
        disableSwap
      />
      <Typography align="center">₹{priceRange[0]} - ₹{priceRange[1]}</Typography>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() => setIsFilterDrawerOpen(false)}
      >
        Apply Filters
      </Button>
    </Drawer>
  );

  const renderContent = () => {
    const isLookingForFlat = userChoice === 'flat';

    return (
      <Grid container spacing={4}>
        {filteredListings.length === 0 ? (
          <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No {isLookingForFlat ? 'flats' : 'flatmates'} found matching your criteria.
            </Typography>
          </Grid>
        ) : (
          filteredListings.map((listing) => (
            <Grid item key={listing._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6 },
                }}
                onClick={() => setSelectedListing(listing)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={listing.profile?.avatar || listing.roomDetails?.images?.[0] || 'https://via.placeholder.com/180'}
                  alt={listing.profile?.name || listing.roomDetails?.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="div" noWrap>
                      {isLookingForFlat ? listing.roomDetails?.name : `${listing.profile?.name}, ${listing.profile?.age}`}
                    </Typography>
                    <IconButton size="small">
                      <FavoriteBorderIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <LocationIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    {isLookingForFlat ? listing.roomDetails?.location?.address : listing.profile?.location?.address}
                  </Typography>
                  {isLookingForFlat ? (
                    <Typography variant="subtitle1" color="text.primary">
                      ₹{listing.roomDetails?.rent} / month
                    </Typography>
                  ) : (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {listing.profile?.bio}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {listing.profile?.gender && (
                          <Chip label={listing.profile.gender} size="small" sx={{ mr: 0.5 }} />
                        )}
                        {listing.profile?.occupation && (
                          <Chip label={listing.profile.occupation} size="small" />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            {userChoice === 'flat' ? 'Find Your Ideal Flat' : 'Find Your Ideal Flatmate'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsPostDialogOpen(true)}
          >
            Post Listing
          </Button>
        </Box>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder={`Search for ${userChoice === 'flat' ? 'flats' : 'flatmates'}...`}
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            Filters
          </Button>
        </Box>
        {renderContent()}
      </Paper>

      {selectedListing && (
        <ListingDetail
          open={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          listing={selectedListing}
          isFlat={userChoice === 'flat'}
        />
      )}

      <PostListing
        open={isPostDialogOpen}
        onClose={() => setIsPostDialogOpen(false)}
        userType={userChoice}
      />

      <FilterDrawer />
    </Container>
  );
} 