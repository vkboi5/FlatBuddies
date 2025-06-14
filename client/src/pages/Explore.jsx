import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TinderCard from 'react-tinder-card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  const handleCardClick = (profile) => {
    navigate(`/profile/${profile._id}`, { state: { profile } });
  };

  const renderProfileCard = (profile) => {
    if (viewMode === 'roommates') {
      return (
        <Card 
          onClick={() => handleCardClick(profile)}
          sx={{
            position: 'relative',
            height: '85vh',
            width: '100%',
            maxWidth: 384,
            mx: 'auto',
            borderRadius: '16px',
            border: '1px solid #e0e0e0',
            boxShadow: '0px 15px 45px rgba(0, 0, 0, 0.2), 0px 30px 90px rgba(0, 0, 0, 0.18)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-12px)',
              boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.25), 0px 40px 100px rgba(0, 0, 0, 0.2)',
            },
            overflow: 'hidden',
            background: '#fdfdfd',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
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
                filter: 'brightness(0.8)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
              }}
            />
            
            {/* Profile Info Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 4,
                color: 'white',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}>
                  {profile.name}
                </Typography>
                {profile.profile?.age && (
                  <Typography variant="h4" sx={{ fontWeight: 'light', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {profile.profile.age}
                  </Typography>
                )}
              </Stack>
              
              {profile.profile?.occupation && (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <FaBriefcase size={18} />
                  <Typography variant="body1">
                    {profile.profile.occupation}
                  </Typography>
                </Stack>
              )}
              
              {profile.profile?.location?.city && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <FaMapMarkerAlt size={18} />
                  <Typography variant="body1">
                    {profile.profile.location.city}
                    {profile.profile.location.area && `, ${profile.profile.location.area}`}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>

          {/* Scrollable Content Wrapper */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              minHeight: 0, // Crucial for flex item to shrink and allow scrolling
              backgroundColor: '#fcfcfc',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#ccc',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#999',
              },
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'thin',
            }}
          >
            <CardContent sx={{ p: 4, pb: 8 }}>
              {/* Basic Info Section */}
              {(profile.profile?.education || profile.profile?.languages?.length > 0) && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaUser size={20} /> Basic Info
                  </Typography>
                  <Grid container spacing={2}>
                    {profile.profile?.education && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Education</Typography>
                        <Typography variant="body1" color="text.primary">{profile.profile.education}</Typography>
                      </Grid>
                    )}
                    {profile.profile?.languages?.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Languages</Typography>
                        <Typography variant="body1" color="text.primary">{profile.profile.languages.join(', ')}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                </Box>
              )}

              {/* Bio Section */}
              {profile.profile?.bio && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaInfo size={20} /> About Me
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {profile.profile.bio}
                  </Typography>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                </Box>
              )}

              {/* Interests Section */}
              {profile.profile?.interests?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaHeart size={20} /> Interests
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {profile.profile.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Stack>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                </Box>
              )}

              {/* Lifestyle Preferences Section */}
              {profile.profile?.preferences?.lifestyle && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaUsers size={20} /> Lifestyle Preferences
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton size="small"><FaBroom size={20} /></IconButton>
                        <Typography variant="subtitle2" color="text.secondary">Cleanliness</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: '100px', height: '6px', borderRadius: '3px', bgcolor: '#e0e0e0' }}>
                            <Box sx={{ width: `${profile.profile.preferences.lifestyle.cleanliness * 10}%`, height: '100%', borderRadius: '3px', bgcolor: 'success.main' }} />
                          </Box>
                          <Typography variant="body2" color="text.primary">{profile.profile.preferences.lifestyle.cleanliness}/10</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton size="small"><FaUsers size={20} /></IconButton>
                        <Typography variant="subtitle2" color="text.secondary">Social Level</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: '100px', height: '6px', borderRadius: '3px', bgcolor: '#e0e0e0' }}>
                            <Box sx={{ width: `${profile.profile.preferences.lifestyle.socialLevel * 10}%`, height: '100%', borderRadius: '3px', bgcolor: 'info.main' }} />
                          </Box>
                          <Typography variant="body2" color="text.primary">{profile.profile.preferences.lifestyle.socialLevel}/10</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton size="small"><FaLaptop size={20} /></IconButton>
                        <Typography variant="subtitle2" color="text.secondary">Work Mode</Typography>
                        <Typography variant="body1">{profile.profile.preferences.lifestyle.workMode}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton size="small"><FaSmoking size={20} /></IconButton>
                        <Typography variant="subtitle2" color="text.secondary">Smoking</Typography>
                        <Typography variant="body1">{profile.profile.preferences.lifestyle.smoking}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton size="small"><FaDog size={20} /></IconButton>
                        <Typography variant="subtitle2" color="text.secondary">Pets</Typography>
                        <Typography variant="body1">{profile.profile.preferences.lifestyle.pets}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton size="small"><FaUtensils size={20} /></IconButton>
                        <Typography variant="subtitle2" color="text.secondary">Food Pref.</Typography>
                        <Typography variant="body1">{profile.profile.preferences.lifestyle.foodPreference}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                </Box>
              )}

              {/* Roommate Preferences Section */}
              {profile.profile?.preferences?.roommates && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaUserFriends size={20} /> Roommate Preferences
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                      <Typography variant="body1">{profile.profile.preferences.roommates.gender}</Typography>
                    </Grid>
                    {profile.profile.preferences.roommates.ageRange && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Age Range</Typography>
                        <Typography variant="body1">{profile.profile.preferences.roommates.ageRange.min} - {profile.profile.preferences.roommates.ageRange.max}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
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
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              pb: 3,
              zIndex: 10, // Ensure buttons are above content
              background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              pt: 4,
            }}
          >
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe('left', profile._id);
              }}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#fff',
                boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <FaTimes size={30} color="#f44336" />
            </Box>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe('right', profile._id);
              }}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#fff',
                boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <FaHeart size={30} color="#4caf50" />
            </Box>
          </Box>
        </Card>
      );
    } else if (viewMode === 'flats') {
      return (
        <Card
          onClick={() => handleCardClick(profile)}
          sx={{
            position: 'relative',
            height: '85vh',
            width: '100%',
            maxWidth: 384,
            mx: 'auto',
            borderRadius: '16px',
            border: '1px solid #e0e0e0',
            boxShadow: '0px 15px 45px rgba(0, 0, 0, 0.2), 0px 30px 90px rgba(0, 0, 0, 0.18)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-12px)',
              boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.25), 0px 40px 100px rgba(0, 0, 0, 0.2)',
            },
            overflow: 'hidden',
            background: '#fdfdfd',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
          }}
        >
          {/* Property Image with Gradient Overlay */}
          <Box sx={{ position: 'relative', height: '50%', flexShrink: 0 }}>
            <CardMedia
              component="img"
              height="100%"
              image={profile.property?.images?.[0] || 'https://via.placeholder.com/400x500'}
              alt={profile.name}
              sx={{ 
                objectFit: 'cover',
                filter: 'brightness(0.8)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
              }}
            />
            
            {/* Property Info Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 4,
                color: 'white',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.4)', mb: 1 }}>
                ₹{profile.property?.rent} / month
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <FaBuilding size={18} />
                <Typography variant="body1">
                  {profile.property?.propertyType} ({profile.property?.bhkType})
                </Typography>
              </Stack>
              {profile.profile?.location?.city && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <FaMapMarkerAlt size={18} />
                  <Typography variant="body1">
                    {profile.profile.location.city}
                    {profile.profile.location.area && `, ${profile.profile.location.area}`}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>

          {/* Scrollable Content Wrapper for Flat Card */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              minHeight: 0, // Crucial for flex item to shrink and allow scrolling
              backgroundColor: '#fcfcfc',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#ccc',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#999',
              },
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'thin',
            }}
          >
            <CardContent sx={{ p: 4, pb: 8 }}>
              {/* Description Section */}
              {profile.property?.description && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaInfo size={20} /> Description
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {profile.property.description}
                  </Typography>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                </Box>
              )}

              {/* Property Details Section */}
              {(profile.property?.furnishingStatus || profile.property?.availableFrom) && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaHome size={20} /> Property Details
                  </Typography>
                  <Grid container spacing={2}>
                    {profile.property?.furnishingStatus && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Furnishing</Typography>
                        <Typography variant="body1">{profile.property.furnishingStatus}</Typography>
                      </Grid>
                    )}
                    {profile.property?.availableFrom && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Available From</Typography>
                        <Typography variant="body1">{new Date(profile.property.availableFrom).toLocaleDateString()}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                </Box>
              )}

              {/* Amenities Section */}
              {profile.property?.amenities?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaWifi size={20} /> Amenities
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {profile.property.amenities.map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Stack>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
                </Box>
              )}

              {/* Preferred Roommate Details for Property Owner */}
              {profile.userType === 'property_owner' && profile.profile?.preferences && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <FaUserFriends size={20} /> Preferred Roommate
                  </Typography>
                  <Grid container spacing={2}>
                    {profile.profile.preferences.roommates?.gender && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                        <Typography variant="body1">{profile.profile.preferences.roommates.gender}</Typography>
                      </Grid>
                    )}
                    {profile.profile.preferences.roommates?.ageRange && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Age Range</Typography>
                        <Typography variant="body1">{profile.profile.preferences.roommates.ageRange.min} - {profile.profile.preferences.roommates.ageRange.max}</Typography>
                      </Grid>
                    )}
                    {profile.profile.preferences.lifestyle && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Smoking</Typography>
                          <Typography variant="body1">{profile.profile.preferences.lifestyle.smoking}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Pets</Typography>
                          <Typography variant="body1">{profile.profile.preferences.lifestyle.pets}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Food Preference</Typography>
                          <Typography variant="body1">{profile.profile.preferences.lifestyle.foodPreference}</Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
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
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              pb: 3,
              zIndex: 10, // Ensure buttons are above content
              background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              pt: 4,
            }}
          >
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe('left', profile._id);
              }}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#fff',
                boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <FaTimes size={30} color="#f44336" />
            </Box>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe('right', profile._id);
              }}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#fff',
                boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <FaHeart size={30} color="#4caf50" />
            </Box>
          </Box>
        </Card>
      );
    } else {
      return (
        <Box>
          <Typography>No more profiles to display.</Typography>
        </Box>
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