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
  FaHeart,
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
    <Box sx={{ bgcolor: '#f5f8fd', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <IconButton
          onClick={() => navigate('/explore')}
          sx={{ mb: 2, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', '&:hover': { background: '#e3f2fd' } }}
        >
          <FaArrowLeft />
        </IconButton>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            position: 'relative',
            background: '#fff',
            boxShadow: '0 8px 32px 0 rgba(36,81,166,0.10)',
          }}
        >
          {/* Header Image */}
          <Box
            sx={{
              height: { xs: 200, sm: 300 },
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
                background: 'linear-gradient(to bottom, rgba(36,81,166,0.1) 0%, rgba(36,81,166,0.3) 100%)',
              },
            }}
          />

          {/* Content */}
          <Box sx={{ mt: -12, position: 'relative', zIndex: 2 }}>
            <Container maxWidth="md">
              <Grid container spacing={4} alignItems="flex-end">
                <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Avatar
                    src={profile.profile?.photos?.[0]}
                    sx={{ width: 160, height: 160, border: '6px solid #fff', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', mx: 'auto' }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ color: 'text.primary', pb: 2, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {profile.name}
                      {profile.profile?.age && (
                        <Typography component="span" variant="h4" sx={{ fontWeight: 'light', ml: 1.5 }}>
                          {profile.profile.age}
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {profile.profile?.occupation}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Grid container spacing={4}>
                  {/* Basic Information */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                      <Paper sx={{ p: 3, borderRadius: 4, background: '#f7fafd', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#2451a6', fontWeight: 700 }}>
                          <FaUser /> Basic Info
                        </Typography>
                        <Stack spacing={2}>
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

                      <Paper sx={{ p: 3, borderRadius: 4, background: '#f7fafd', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#2451a6', fontWeight: 700 }}>
                          <FaMapMarkerAlt /> Location
                        </Typography>
                        {profile.profile?.location?.city && (
                          <Typography variant="body1">
                            {profile.profile.location.city}
                            {profile.profile.location.area && `, ${profile.profile.location.area}`}
                          </Typography>
                        )}
                      </Paper>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                      {profile.profile?.bio && (
                        <Paper sx={{ p: 3, borderRadius: 4, background: '#f7fafd', boxShadow: 'none' }}>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#2451a6', fontWeight: 700 }}>
                            <FaInfo /> About Me
                          </Typography>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {profile.profile.bio}
                          </Typography>
                        </Paper>
                      )}

                      {profile.profile?.interests?.length > 0 && (
                        <Paper sx={{ p: 3, borderRadius: 4, background: '#f7fafd', boxShadow: 'none' }}>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#2451a6', fontWeight: 700 }}>
                            <FaHeart /> Interests
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {profile.profile.interests.map((interest, index) => (
                              <Chip
                                key={index}
                                label={interest}
                                sx={{ m: 0.5, borderRadius: '999px', bgcolor: '#e3eafc', color: '#2451a6', fontWeight: 600 }}
                              />
                            ))}
                          </Stack>
                        </Paper>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileDetail; 