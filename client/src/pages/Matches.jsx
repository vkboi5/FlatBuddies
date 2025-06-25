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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f8fd', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              color: '#2451a6',
              letterSpacing: 1
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
                        borderRadius: 6,
                        overflow: 'visible',
                        boxShadow: '0 4px 24px 0 rgba(36,81,166,0.10)',
                        background: '#fff',
                        transition: 'transform 0.18s, box-shadow 0.18s',
                        p: 0,
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.03)',
                          boxShadow: '0 12px 40px 0 rgba(36,81,166,0.13)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, pb: 2, px: 2, position: 'relative', bgcolor: '#f7faff', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
                        <Avatar
                          src={details.photo}
                          alt={details.title}
                          sx={{
                            width: 96,
                            height: 96,
                            border: '4px solid #2451a6',
                            boxShadow: '0 4px 16px 0 rgba(36,81,166,0.10)',
                            fontSize: 40,
                            bgcolor: '#e3eafc',
                            mb: 1.5,
                          }}
                        >
                          {!details.photo && details.title.charAt(0)}
                        </Avatar>
                        <Chip
                          label={getMatchType(match)}
                          sx={{
                            fontWeight: 700,
                            borderRadius: '999px',
                            fontSize: '1rem',
                            px: 2.5,
                            py: 1,
                            background: match.userType === 'room_provider' ? '#e3eafc' : '#ffe0ef',
                            color: match.userType === 'room_provider' ? '#2451a6' : '#d81b60',
                            mb: 0.5,
                            mt: 0.5,
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3, pt: 2 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#2451a6', mb: 1, textAlign: 'center' }}>
                          {details.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          <LocationOn sx={{ mr: 1, color: '#2451a6' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>{details.location}</Typography>
                        </Box>

                        {match.userType === 'room_provider' ? (
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                              <Home sx={{ mr: 1, color: '#2451a6' }} />
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>{details.propertyType} • {details.bhkType}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                              <AttachMoney sx={{ mr: 1, color: '#2451a6' }} />
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>₹{details.rent}</Typography>
                            </Box>
                            {details.amenities.length > 0 && (
                              <Box sx={{ mb: 1, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, color: '#2451a6' }}>
                                  Amenities:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                  {details.amenities.map((amenity, index) => (
                                    <Chip
                                      key={index}
                                      label={amenity}
                                      size="small"
                                      sx={{ borderRadius: '999px', px: 2, py: 0.5, fontWeight: 600, bgcolor: '#e3eafc', color: '#2451a6', fontSize: '0.98rem', mb: 0.5 }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </>
                        ) : (
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                              <AttachMoney sx={{ mr: 1, color: '#2451a6' }} />
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>Budget: ₹{details.budget}</Typography>
                            </Box>
                            {details.interests.length > 0 && (
                              <Box sx={{ mb: 1, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, color: '#2451a6' }}>
                                  Interests:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                  {details.interests.slice(0, 3).map((interest, index) => (
                                    <Chip
                                      key={index}
                                      label={interest}
                                      size="small"
                                      sx={{ borderRadius: '999px', px: 2, py: 0.5, fontWeight: 600, bgcolor: '#e3eafc', color: '#2451a6', fontSize: '0.98rem', mb: 0.5 }}
                                    />
                                  ))}
                                  {details.interests.length > 3 && (
                                    <Chip
                                      label={`+${details.interests.length - 3} more`}
                                      size="small"
                                      variant="outlined"
                                      sx={{ borderRadius: '999px', px: 2, py: 0.5, fontWeight: 600, fontSize: '0.98rem', mb: 0.5 }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            )}
                          </>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          <Work sx={{ mr: 1, color: '#2451a6' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>{details.occupation}</Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center', fontSize: '1.05rem' }}>
                          {details.bio}
                        </Typography>

                        {match.userType === 'room_provider' && details.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center', fontSize: '1.05rem' }}>
                            <strong>Property Description:</strong> {details.description}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
                          <Button
                            variant="contained"
                            startIcon={<Message />}
                            sx={{
                              borderRadius: '999px',
                              fontWeight: 700,
                              px: 3,
                              py: 1.2,
                              fontSize: '1.05rem',
                              minWidth: 120,
                              background: '#2451a6',
                              color: '#fff',
                              boxShadow: '0 2px 8px 0 rgba(36,81,166,0.10)',
                              '&:hover': { background: '#1d3e7a' },
                            }}
                          >
                            Message
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Phone />}
                            sx={{
                              borderRadius: '999px',
                              fontWeight: 700,
                              px: 3,
                              py: 1.2,
                              fontSize: '1.05rem',
                              minWidth: 120,
                              background: '#fff',
                              border: '2px solid #2451a6',
                              color: '#2451a6',
                              boxShadow: 'none',
                              '&:hover': { background: '#e3eafc', borderColor: '#2451a6', color: '#2451a6' },
                            }}
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
    </Box>
  );
} 