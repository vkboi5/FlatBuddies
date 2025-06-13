import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaUserFriends, FaSearch, FaArrowsAltH } from 'react-icons/fa';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const Landing = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e3f2fd, #e8eaf6)', // Equivalent to bg-gradient-to-br from-blue-50 to-indigo-100
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ px: 4, py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
            Find Your Perfect Roommate & Flat
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, maxWidth: 'md', mx: 'auto' }}>
            RoomEase makes it easy to find compatible roommates and ideal living spaces.
            Join our community and start your journey to better living.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '9999px',
                fontWeight: 'semibold',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/auth"
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '9999px',
                fontWeight: 'semibold',
                backgroundColor: 'white',
                '&:hover': { backgroundColor: 'grey.50' },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: 'white', py: 8 }}>
        <Container maxWidth="lg" sx={{ px: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {/* Create Profile */}
            <Grid item xs={12} md={6} lg={3}>
              <StyledPaper elevation={3}>
                <IconButton color="primary" sx={{ fontSize: '3rem', mb: 2 }}>
                  <FaUserFriends />
                </IconButton>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'semibold', mb: 1 }}>
                  Create a Profile
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Build your personalized profile sharing your lifestyle, interests, and living preferences.
                </Typography>
              </StyledPaper>
            </Grid>

            {/* Set Preferences */}
            <Grid item xs={12} md={6} lg={3}>
              <StyledPaper elevation={3}>
                <IconButton color="primary" sx={{ fontSize: '3rem', mb: 2 }}>
                  <FaSearch />
                </IconButton>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'semibold', mb: 1 }}>
                  Set Preferences
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Customize your search with specific preferences like budget, location, and living habits.
                </Typography>
              </StyledPaper>
            </Grid>

            {/* Find Flats */}
            <Grid item xs={12} md={6} lg={3}>
              <StyledPaper elevation={3}>
                <IconButton color="primary" sx={{ fontSize: '3rem', mb: 2 }}>
                  <FaHome />
                </IconButton>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'semibold', mb: 1 }}>
                  Find Flats
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Browse through available flats and find your perfect living space.
                </Typography>
              </StyledPaper>
            </Grid>

            {/* Swipe and Match */}
            <Grid item xs={12} md={6} lg={3}>
              <StyledPaper elevation={3}>
                <IconButton color="primary" sx={{ fontSize: '3rem', mb: 2 }}>
                  <FaArrowsAltH />
                </IconButton>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'semibold', mb: 1 }}>
                  Swipe and Match
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Connect with potential roommates through our easy-to-use swipe interface.
                </Typography>
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg" sx={{ px: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Find Your Perfect Match?
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Join thousands of users who found their ideal living situation with RoomEase.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              borderRadius: '9999px',
              fontWeight: 'semibold',
              '&:hover': { backgroundColor: 'grey.50' },
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 