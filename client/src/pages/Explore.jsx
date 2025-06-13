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
} from '@mui/material';
import { FaHeart, FaTimes, FaHome, FaUserFriends } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000';

const Explore = () => {
  const { currentUser, likeProfile, dislikeProfile, userChoice } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [viewMode, setViewMode] = useState(userChoice === 'room_seeker' ? 'flats' : 'roommates'); // Initialize based on userChoice
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, [viewMode, userChoice]); // Add userChoice to dependency array

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
      // Remove the swiped profile from the list
      setProfiles(prev => prev.filter(p => p._id !== profileId));
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  };

  const renderProfileCard = (profile) => {
    if (viewMode === 'roommates') {
      return (
        <Card sx={{ position: 'relative', height: 600, width: '100%', maxWidth: 384, mx: 'auto', borderRadius: '1rem', boxShadow: 3, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="400"
            image={profile.profile?.photos?.[0] || 'https://via.placeholder.com/400x500'}
            alt={profile.name}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {profile.name}, {profile.profile?.age}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{profile.profile?.occupation}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{profile.profile?.location?.city}, {profile.profile?.location?.area}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{profile.profile?.bio}</Typography>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.profile?.preferences?.lifestyle?.smoking && (
                <Chip
                  label={profile.profile.preferences.lifestyle.smoking === 'yes' ? 'Smoker' : 'Non-smoker'}
                  size="small"
                  sx={{ backgroundColor: 'grey.100' }}
                />
              )}
              {profile.profile?.preferences?.lifestyle?.pets && (
                <Chip
                  label={profile.profile.preferences.lifestyle.pets === 'yes' ? 'Has pets' : 'No pets'}
                  size="small"
                  sx={{ backgroundColor: 'grey.100' }}
                />
              )}
              {profile.profile?.preferences?.lifestyle?.foodPreference && (
                <Chip
                  label={profile.profile.preferences.lifestyle.foodPreference}
                  size="small"
                  sx={{ backgroundColor: 'grey.100' }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card sx={{ position: 'relative', height: 600, width: '100%', maxWidth: 384, mx: 'auto', borderRadius: '1rem', boxShadow: 3, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="400"
            image={profile.roomDetails?.photos?.[0] || 'https://via.placeholder.com/400x500'}
            alt={profile.roomDetails?.title}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{profile.roomDetails?.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>₹{profile.roomDetails?.rent}/month</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{profile.roomDetails?.address}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{profile.roomDetails?.description}</Typography>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.roomDetails?.type && (
                <Chip label={profile.roomDetails.type} size="small" sx={{ backgroundColor: 'grey.100' }} />
              )}
              {profile.roomDetails?.furnishingStatus && (
                <Chip label={profile.roomDetails.furnishingStatus} size="small" sx={{ backgroundColor: 'grey.100' }} />
              )}
              {profile.roomDetails?.bedrooms && (
                <Chip label={`${profile.roomDetails.bedrooms} Beds`} size="small" sx={{ backgroundColor: 'grey.100' }} />
              )}
            </Box>
          </CardContent>
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

        {/* Cards Container */}
        <Box sx={{ position: 'relative', height: 600, width: '100%', maxWidth: 384, mx: 'auto' }}>
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <TinderCard
                key={profile._id}
                onSwipe={(dir) => handleSwipe(dir, profile._id)}
                preventSwipe={['up', 'down']}
                className="absolute w-full"
              >
                {renderProfileCard(profile)}
              </TinderCard>
            ))
          ) : (
            <Paper sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', boxShadow: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 1 }}>No more profiles</Typography>
                <Typography variant="body1" color="text.secondary">Check back later for new matches!</Typography>
              </Box>
            </Paper>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
          <IconButton
            onClick={() => handleSwipe('left', profiles[0]?._id)}
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'white',
              boxShadow: 3,
              color: 'error.main',
              '&:hover': { backgroundColor: 'error.light', color: 'white' },
            }}
          >
            <FaTimes size={32} />
          </IconButton>
          <IconButton
            onClick={() => handleSwipe('right', profiles[0]?._id)}
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'white',
              boxShadow: 3,
              color: 'success.main',
              '&:hover': { backgroundColor: 'success.light', color: 'white' },
            }}
          >
            <FaHeart size={32} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Explore;