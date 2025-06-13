import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
  Rating,
  TextField,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useState } from 'react';

export default function ListingDetail({ listing, open, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // TODO: Implement messaging functionality
    console.log('Message:', message);
    setMessage('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative' }}>
          <img
            src={listing.images[0]}
            alt={listing.title}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
            }}
          />
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={() => setIsFavorite(!isFavorite)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 56,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            }}
          >
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {listing.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  {listing.location} ({listing.distance} km)
                </Typography>
              </Box>

              <Typography variant="h4" color="primary" gutterBottom>
                ₹{listing.price.toLocaleString()}/month
              </Typography>

              <Box sx={{ my: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {listing.description}
                </Typography>
              </Box>

              <Box sx={{ my: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Amenities
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {listing.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ my: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Preferences
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1">
                      {listing.preferences.gender === 'any' ? 'Any' : 
                       listing.preferences.gender === 'male' ? 'Male' : 'Female'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Age Range
                    </Typography>
                    <Typography variant="body1">
                      {listing.preferences.ageRange.min} - {listing.preferences.ageRange.max} years
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Occupation
                    </Typography>
                    <Typography variant="body1">
                      {listing.preferences.occupation === 'any' ? 'Any' : listing.preferences.occupation}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Available From
                    </Typography>
                    <Typography variant="body1">
                      {new Date(listing.availableFrom).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={listing.postedBy.image}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      {listing.postedBy.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {listing.postedBy.occupation}
                    </Typography>
                    <Rating value={4.5} readOnly precision={0.5} size="small" />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Send a message
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Hi, I'm interested in your listing..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<MessageIcon />}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    Send Message
                  </Button>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhoneIcon />}
                  sx={{ mt: 1 }}
                >
                  Show Contact
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 