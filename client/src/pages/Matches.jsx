import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  LocationOn,
  Home,
  AttachMoney,
  Work,
  Favorite,
  Message,
  Phone,
  Email,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Matches() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (!currentUser) return;

        const token = await currentUser.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          'http://localhost:5000/api/profiles/matches',
          config
        );
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast.error('Failed to load matches.');
      }
    };

    fetchMatches();
  }, [currentUser]);

  const getMatchType = (match) => {
    return match.userType === 'room_provider' ? 'Room Provider' : 'Room Seeker';
  };

  const getMatchDetails = (match) => {
    if (match.userType === 'room_provider') {
      return {
        title: match.name || 'Anonymous',
        location: match.profile?.location?.city || 'Location not specified',
        propertyType: match.roomDetails?.type || 'Not specified',
        rent: match.roomDetails?.rent || 'Not specified',
        occupation: match.profile?.occupation || 'Not specified',
        photo: match.profile?.photos?.[0] || '',
        age: match.profile?.age || 'Not specified',
        gender: match.profile?.gender || 'Not specified',
        bio: match.profile?.bio || 'No bio available',
        bhkType: match.roomDetails?.bhkType || 'Not specified',
        availableFrom: match.roomDetails?.availableFrom || 'Not specified',
        amenities: match.roomDetails?.amenities || [],
        description: match.roomDetails?.description || 'No description available'
      };
    } else {
      return {
        title: match.name || 'Anonymous',
        location: match.profile?.location?.city || 'Location not specified',
        budget: `${match.profile?.preferences?.budget?.min || 0} - ${match.profile?.preferences?.budget?.max || 0}`,
        occupation: match.profile?.occupation || 'Not specified',
        photo: match.profile?.photos?.[0] || '',
        age: match.profile?.age || 'Not specified',
        gender: match.profile?.gender || 'Not specified',
        bio: match.profile?.bio || 'No bio available',
        interests: match.profile?.interests || [],
        lifestyle: match.profile?.preferences?.lifestyle || {}
      };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Your Matches
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {matches.length > 0 ? (
          matches.map((match, index) => {
            const details = getMatchDetails(match);
            return (
              <Grid item xs={12} md={6} lg={4} key={match._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        height: 200,
                        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
                      }}
                    >
                      {details.photo ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={details.photo}
                          alt={details.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 100,
                              height: 100,
                              bgcolor: theme.palette.primary.main,
                              fontSize: '2rem',
                            }}
                          >
                            {details.title.charAt(0)}
                          </Avatar>
                        </Box>
                      )}
                      <Chip
                        label={getMatchType(match)}
                        color={match.userType === 'room_provider' ? 'primary' : 'secondary'}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h5" gutterBottom fontWeight="bold">
                        {details.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">{details.location}</Typography>
                      </Box>

                      {match.userType === 'room_provider' ? (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Home sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body1">
                              {details.propertyType} • {details.bhkType}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body1">₹{details.rent}</Typography>
                          </Box>
                          {details.amenities.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Amenities:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {details.amenities.map((amenity, index) => (
                                  <Chip
                                    key={index}
                                    label={amenity}
                                    size="small"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </>
                      ) : (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body1">Budget: ₹{details.budget}</Typography>
                          </Box>
                          {details.interests.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Interests:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {details.interests.slice(0, 3).map((interest, index) => (
                                  <Chip
                                    key={index}
                                    label={interest}
                                    size="small"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                ))}
                                {details.interests.length > 3 && (
                                  <Chip
                                    label={`+${details.interests.length - 3} more`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </Box>
                          )}
                        </>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Work sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">{details.occupation}</Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {details.bio}
                      </Typography>

                      {match.userType === 'room_provider' && details.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          <strong>Property Description:</strong> {details.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<Message />}
                          fullWidth
                          sx={{ borderRadius: 2 }}
                        >
                          Message
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Phone />}
                          fullWidth
                          sx={{ borderRadius: 2 }}
                        >
                          Contact
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Favorite sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No matches yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start swiping to find your perfect match!
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
} 