import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Stack,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import {
  FaArrowLeft,
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

const ProfileDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state || {};

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Profile not found</Typography>
        <Button
          startIcon={<FaArrowLeft />}
          onClick={() => navigate('/explore')}
          sx={{ mt: 2 }}
        >
          Back to Explore
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <IconButton
        onClick={() => navigate('/explore')}
        sx={{ mb: 3 }}
      >
        <FaArrowLeft />
      </IconButton>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header Image */}
        <Box
          sx={{
            height: '400px',
            position: 'relative',
            backgroundImage: `url(${profile.profile?.photos?.[0] || 'https://via.placeholder.com/1200x400'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
            },
          }}
        >
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={profile.profile?.photos?.[0]}
                sx={{ width: 100, height: 100, border: '4px solid white' }}
              />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}>
                  {profile.name}
                </Typography>
                {profile.profile?.age && (
                  <Typography variant="h5" sx={{ fontWeight: 'light', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {profile.profile.age} years old
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaUser /> Basic Information
                </Typography>
                <Stack spacing={2}>
                  {profile.profile?.occupation && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Occupation</Typography>
                      <Typography variant="body1">{profile.profile.occupation}</Typography>
                    </Box>
                  )}
                  {profile.profile?.education && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Education</Typography>
                      <Typography variant="body1">{profile.profile.education}</Typography>
                    </Box>
                  )}
                  {profile.profile?.languages?.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Languages</Typography>
                      <Typography variant="body1">{profile.profile.languages.join(', ')}</Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Location & Preferences */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaMapMarkerAlt /> Location & Preferences
                </Typography>
                <Grid container spacing={2}>
                  {profile.profile?.location?.city && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                      <Typography variant="body1">
                        {profile.profile.location.city}
                        {profile.profile.location.area && `, ${profile.profile.location.area}`}
                      </Typography>
                    </Grid>
                  )}
                  {profile.profile?.preferences?.budget && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Budget Range</Typography>
                      <Typography variant="body1">
                        ₹{profile.profile.preferences.budget.min} - ₹{profile.profile.preferences.budget.max}
                      </Typography>
                    </Grid>
                  )}
                  {profile.profile?.preferences?.roommates?.gender && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Preferred Roommate Gender</Typography>
                      <Typography variant="body1">
                        {profile.profile.preferences.roommates.gender}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Lifestyle Preferences */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaUsers /> Lifestyle Preferences
                </Typography>
                <Grid container spacing={2}>
                  {profile.profile?.preferences?.lifestyle && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Cleanliness</Typography>
                        <Typography variant="body1">
                          {profile.profile.preferences.lifestyle.cleanliness}/10
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Social Level</Typography>
                        <Typography variant="body1">
                          {profile.profile.preferences.lifestyle.socialLevel}/10
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Work Mode</Typography>
                        <Typography variant="body1">
                          {profile.profile.preferences.lifestyle.workMode}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Smoking</Typography>
                        <Typography variant="body1">
                          {profile.profile.preferences.lifestyle.smoking}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Pets</Typography>
                        <Typography variant="body1">
                          {profile.profile.preferences.lifestyle.pets}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Food Preference</Typography>
                        <Typography variant="body1">
                          {profile.profile.preferences.lifestyle.foodPreference}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Bio */}
            {profile.profile?.bio && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaInfo /> About Me
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {profile.profile.bio}
                  </Typography>
                </Paper>
              </Grid>
            )}

            {/* Interests */}
            {profile.profile?.interests?.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaHeart /> Interests
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
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileDetail; 