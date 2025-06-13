import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TinderCard from 'react-tinder-card';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { 
  FaHeart, 
  FaTimes, 
  FaHome, 
  FaUserFriends, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaInfo,
  FaSmoking,
  FaDog,
  FaUtensils,
  FaClock,
  FaBed,
  FaShower,
  FaWifi,
  FaParking,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaGraduationCap,
  FaLanguage,
  FaMusic,
  FaGamepad,
  FaBook,
  FaRunning,
  FaCoffee,
  FaBroom,
  FaUsers,
  FaLaptop,
  FaBuilding,
} from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000';

const Explore = () => {
  const { currentUser, likeProfile, dislikeProfile, userChoice } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState(userChoice === 'room_seeker' ? 'flats' : 'roommates');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, [viewMode, userChoice]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/profiles/potential-matches?type=${viewMode}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      
      const data = await response.json();
      setProfiles(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction, profileId) => {
    try {
      if (direction === 'right') {
        await likeProfile(profileId);
      } else {
        await dislikeProfile(profileId);
      }
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  };

  const renderProfileCard = (profile) => {
    if (viewMode === 'roommates') {
      return (
        <Card 
          sx={{ 
            position: 'relative',
            height: '85vh',
            width: '100%',
            maxWidth: 384,
            mx: 'auto',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Profile Image with Gradient Overlay */}
          <Box sx={{ position: 'relative', height: '50%', flexShrink: 0 }}>
          <CardMedia
            component="img"
              height="100%"
            image={profile.profile?.photos?.[0] || 'https://via.placeholder.com/400x500'}
            alt={profile.name}
              sx={{ 
                objectFit: 'cover',
                filter: 'brightness(0.9)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
              }}
            />
            
            {/* Profile Info Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                color: 'white',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {profile.name}
                </Typography>
                {profile.profile?.age && (
                  <Typography variant="h5" sx={{ fontWeight: 'light' }}>
                    {profile.profile.age}
                  </Typography>
                )}
              </Stack>
              
              {profile.profile?.occupation && (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <FaBriefcase size={16} />
                  <Typography variant="body1">
                    {profile.profile.occupation}
                  </Typography>
                </Stack>
              )}
              
              {profile.profile?.location?.city && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <FaMapMarkerAlt size={16} />
                  <Typography variant="body1">
                    {profile.profile.location.city}
                    {profile.profile.location.area && `, ${profile.profile.location.area}`}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>

          {/* Profile Details Section */}
          <Box 
            sx={{ 
              flex: 1,
              overflowY: 'auto',
              position: 'relative',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
            }}
          >
            <CardContent sx={{ p: 3, pb: 8 }}>
              {/* Basic Info Section */}
              {(profile.profile?.education || profile.profile?.languages?.length > 0) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaUser size={16} /> Basic Info
                  </Typography>
                  <Grid container spacing={2}>
                    {profile.profile?.education && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Education</Typography>
                        <Typography variant="body2">{profile.profile.education}</Typography>
                      </Grid>
                    )}
                    {profile.profile?.languages?.length > 0 && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Languages</Typography>
                        <Typography variant="body2">{profile.profile.languages.join(', ')}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Bio Section */}
              {profile.profile?.bio && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaInfo size={16} /> About
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.profile.bio}
                  </Typography>
                </Box>
              )}

              {/* Lifestyle Preferences */}
              {(profile.profile?.preferences?.lifestyle?.cleanliness || 
                profile.profile?.preferences?.lifestyle?.socialLevel || 
                profile.profile?.preferences?.lifestyle?.workMode || 
                profile.profile?.preferences?.lifestyle?.smoking || 
                profile.profile?.preferences?.lifestyle?.pets || 
                profile.profile?.preferences?.lifestyle?.foodPreference) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaCoffee size={16} /> Lifestyle
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Cleanliness Scale */}
                    {profile.profile?.preferences?.lifestyle?.cleanliness && (
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <FaBroom size={16} color="#666" />
                            <Typography variant="subtitle2" color="text.secondary">Cleanliness</Typography>
                          </Stack>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: '100%',
                                height: 6,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderRadius: 3,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${(profile.profile.preferences.lifestyle.cleanliness / 10) * 100}%`,
                                  height: '100%',
                                  backgroundColor: '#4caf50',
                                  borderRadius: 3,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'right' }}>
                              {profile.profile.preferences.lifestyle.cleanliness}/10
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {/* Social Level Scale */}
                    {profile.profile?.preferences?.lifestyle?.socialLevel && (
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <FaUsers size={16} color="#666" />
                            <Typography variant="subtitle2" color="text.secondary">Social Level</Typography>
                          </Stack>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: '100%',
                                height: 6,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderRadius: 3,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${(profile.profile.preferences.lifestyle.socialLevel / 10) * 100}%`,
                                  height: '100%',
                                  backgroundColor: '#2196f3',
                                  borderRadius: 3,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'right' }}>
                              {profile.profile.preferences.lifestyle.socialLevel}/10
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {/* Work Mode */}
                    {profile.profile?.preferences?.lifestyle?.workMode && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            {profile.profile.preferences.lifestyle.workMode === 'wfh' ? (
                              <FaLaptop size={16} color="#666" />
                            ) : profile.profile.preferences.lifestyle.workMode === 'office' ? (
                              <FaBuilding size={16} color="#666" />
                            ) : (
                              <FaUsers size={16} color="#666" />
                            )}
                            <Typography variant="subtitle2" color="text.secondary">Work Mode</Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {profile.profile.preferences.lifestyle.workMode === 'wfh' ? 'Work from Home' :
                             profile.profile.preferences.lifestyle.workMode === 'office' ? 'Office Work' :
                             'Hybrid Work'}
            </Typography>
                        </Box>
                      </Grid>
                    )}

                    {/* Other Preferences */}
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {profile.profile?.preferences?.lifestyle?.smoking && (
                <Chip
                            icon={<FaSmoking size={16} />}
                  label={profile.profile.preferences.lifestyle.smoking === 'yes' ? 'Smoker' : 'Non-smoker'}
                  size="small"
                            sx={{ 
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                            }}
                />
              )}
              {profile.profile?.preferences?.lifestyle?.pets && (
                <Chip
                            icon={<FaDog size={16} />}
                  label={profile.profile.preferences.lifestyle.pets === 'yes' ? 'Has pets' : 'No pets'}
                  size="small"
                            sx={{ 
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                            }}
                />
              )}
              {profile.profile?.preferences?.lifestyle?.foodPreference && (
                <Chip
                            icon={<FaUtensils size={16} />}
                  label={profile.profile.preferences.lifestyle.foodPreference}
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                            }}
                          />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Interests */}
              {profile.profile?.interests?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaMusic size={16} /> Interests
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {profile.profile.interests.map((interest, index) => (
                <Chip
                        key={index}
                        label={interest}
                  size="small"
                        sx={{ 
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Daily Routine */}
              {(profile.profile?.routine?.wakeUpTime || profile.profile?.routine?.sleepTime) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaClock size={16} /> Daily Routine
                  </Typography>
                  <Grid container spacing={2}>
                    {profile.profile?.routine?.wakeUpTime && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Wake up time</Typography>
                        <Typography variant="body2">{profile.profile.routine.wakeUpTime}</Typography>
                      </Grid>
                    )}
                    {profile.profile?.routine?.sleepTime && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Sleep time</Typography>
                        <Typography variant="body2">{profile.profile.routine.sleepTime}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Box>

          {/* Action Buttons - New Design */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              zIndex: 1,
            }}
          >
            <Box
              onClick={() => handleSwipe('left', profile._id)}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#ff4b4b',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <FaTimes size={28} />
            </Box>
            
            <Box
              onClick={() => handleSwipe('right', profile._id)}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#4caf50',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <FaHeart size={28} />
            </Box>
          </Box>
        </Card>
      );
    } else {
      return (
        <Card 
          sx={{ 
            position: 'relative',
            height: '85vh',
            width: '100%',
            maxWidth: 384,
            mx: 'auto',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Room Image with Gradient Overlay */}
          <Box sx={{ position: 'relative', height: '50%' }}>
          <CardMedia
            component="img"
              height="100%"
            image={profile.roomDetails?.photos?.[0] || 'https://via.placeholder.com/400x500'}
            alt={profile.roomDetails?.title}
              sx={{ 
                objectFit: 'cover',
                filter: 'brightness(0.9)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
              }}
            />
            
            {/* Room Info Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                color: 'white',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {profile.roomDetails?.title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                ₹{profile.roomDetails?.rent}/month
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <FaMapMarkerAlt size={16} />
                <Typography variant="body1">
                  {profile.roomDetails?.address}
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* Room Details Section */}
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
          }}>
            <CardContent sx={{ p: 3, pb: 8 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                {profile.roomDetails?.description}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Features
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {profile.roomDetails?.type && (
                    <Chip
                      label={profile.roomDetails.type}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                      }}
                    />
              )}
              {profile.roomDetails?.furnishingStatus && (
                    <Chip
                      label={profile.roomDetails.furnishingStatus}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                      }}
                    />
              )}
              {profile.roomDetails?.bedrooms && (
                    <Chip
                      label={`${profile.roomDetails.bedrooms} Beds`}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Box>

          {/* Action Buttons - New Design */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              zIndex: 1,
            }}
          >
            <Box
              onClick={() => handleSwipe('left', profile._id)}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#ff4b4b',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <FaTimes size={28} />
            </Box>
            
            <Box
              onClick={() => handleSwipe('right', profile._id)}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#4caf50',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <FaHeart size={28} />
            </Box>
          </Box>
        </Card>
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: 'blue.600' }} />
      </Box>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 4 }}>
          {userChoice === 'room_seeker' ? (
            <Tabs
              value={viewMode}
              onChange={(e, newValue) => setViewMode(newValue)}
              centered
              sx={{ mb: 2 }}
            >
              <Tab
                value="flats"
                label="Flats"
                icon={<FaHome />}
                iconPosition="start"
              />
            </Tabs>
          ) : (
            <Tabs
              value={viewMode}
              onChange={(e, newValue) => setViewMode(newValue)}
              centered
              sx={{ mb: 2 }}
            >
              <Tab
                value="roommates"
                label="Roommates"
                icon={<FaUserFriends />}
                iconPosition="start"
              />
            </Tabs>
          )}
        </Box>

        {/* Card Container */}
        <Box sx={{ position: 'relative', height: '85vh', width: '100%', maxWidth: 384, mx: 'auto' }}>
          {currentProfile ? (
              <TinderCard
              key={currentProfile._id}
              onSwipe={(dir) => handleSwipe(dir, currentProfile._id)}
                preventSwipe={['up', 'down']}
                className="absolute w-full"
              swipeRequirementFulfilled={(dir, absX, absY) => {
                // Only allow swipe if the user is not scrolling
                return absX > absY;
              }}
              >
              {renderProfileCard(currentProfile)}
              </TinderCard>
          ) : (
            <Paper 
              sx={{ 
                position: 'absolute', 
                inset: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '1.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                background: 'white',
              }}
            >
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                  No more profiles
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Check back later for new matches!
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Explore;